import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { createAuditLog } from "./audit";
import { auth } from "@/lib/auth";

async function getSession(headers: Headers) {
  return auth.api.getSession({ headers });
}

export const reportsService = new Elysia({ prefix: "/reports", aot: false })
  .derive(async ({ request }) => {
    const session = await getSession(request.headers);
    return { session };
  })
  .post(
    "/",
    async ({ body, request, ip, session }) => {
      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }
      const report = await prisma.report.create({
        data: {
          userId: session.user.id,
          personId: body.personId,
          description: body.description,
          status: "pending",
          documents: {
            create: (body.documents ?? []).map((d: { name: string; url: string }) => ({
              name: d.name,
              url: d.url,
            })),
          },
        },
        include: { person: true, documents: true },
      });
      await createAuditLog({
        action: "create",
        entity: "Report",
        entityId: report.id,
        userId: session.user.id,
        details: JSON.stringify({ personId: body.personId }),
        ipAddress: ip?.address,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });
      return report;
    },
    {
      body: t.Object({
        personId: t.String(),
        description: t.String({ minLength: 50 }),
        documents: t.Optional(t.Array(t.Object({ name: t.String(), url: t.String() }))),
      }),
    },
  )
  .get("/my", async ({ request, session }) => {
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    const reports = await prisma.report.findMany({
      where: { userId: session.user.id },
      include: { person: true, documents: true },
      orderBy: { createdAt: "desc" },
    });
    return reports;
  })
  .get("/pending", async ({ request, session }) => {
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    const admin = await prisma.admin.findUnique({
      where: { userId: session.user.id },
    });
    if (!admin) {
      throw new Error("Forbidden: Admin only");
    }
    const reports = await prisma.report.findMany({
      where: { status: "pending" },
      include: { person: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return reports;
  })
  .put(
    "/:id/approve",
    async ({ params, request, ip, session }) => {
      if (!session?.user?.id) throw new Error("Unauthorized");
      const admin = await prisma.admin.findUnique({
        where: { userId: session.user.id },
      });
      if (!admin) throw new Error("Forbidden: Admin only");

      const report = await prisma.report.update({
        where: { id: params.id },
        data: { status: "accepted", reviewedBy: session.user.id, reviewedAt: new Date() },
        include: { person: true },
      });
      await createAuditLog({
        action: "approve",
        entity: "Report",
        entityId: report.id,
        userId: session.user.id,
        ipAddress: ip?.address,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });
      return report;
    },
    { params: t.Object({ id: t.String() }) },
  )
  .put(
    "/:id/reject",
    async ({ params, request, ip, session }) => {
      if (!session?.user?.id) throw new Error("Unauthorized");
      const admin = await prisma.admin.findUnique({
        where: { userId: session.user.id },
      });
      if (!admin) throw new Error("Forbidden: Admin only");

      const report = await prisma.report.update({
        where: { id: params.id },
        data: { status: "rejected", reviewedBy: session.user.id, reviewedAt: new Date() },
        include: { person: true },
      });
      await createAuditLog({
        action: "reject",
        entity: "Report",
        entityId: report.id,
        userId: session.user.id,
        ipAddress: ip?.address,
        userAgent: request.headers.get("user-agent") ?? undefined,
      });
      return report;
    },
    { params: t.Object({ id: t.String() }) },
  );
