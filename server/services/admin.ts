import { Elysia, t } from "elysia";
import { prisma } from "../db";
import { createAuditLog } from "./audit";
import { auth } from "@/lib/auth";

async function getSession(headers: Headers) {
  return auth.api.getSession({ headers });
}

const adminGuard = new Elysia({ name: "adminGuard" }).derive(async ({ request }) => {
  const session = await getSession(request.headers);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const admin = await prisma.admin.findUnique({
    where: { userId: session.user.id },
  });
  if (!admin) throw new Error("Forbidden: Admin only");
  return { session, admin };
});

export const adminService = new Elysia({ prefix: "/admin", aot: false })
  .use(adminGuard)
  // Categories
  .get("/categories", async ({ ip }) => {
    const data = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return { data };
  })
  .post(
    "/categories",
    async ({ body, request, ip, session }) => {
      const cat = await prisma.category.create({
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description,
          type: body.type ?? "general",
          sortOrder: body.sortOrder ?? 0,
          isActive: body.isActive ?? true,
        },
      });
      await createAuditLog({
        action: "create",
        entity: "Category",
        entityId: cat.id,
        details: JSON.stringify({ name: cat.name, slug: cat.slug }),
        ctx: {
          userId: session.user.id,
          ipAddress: ip?.address,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      });
      return cat;
    },
    {
      body: t.Object({
        name: t.String(),
        slug: t.String(),
        description: t.Optional(t.String()),
        type: t.Optional(t.String()),
        sortOrder: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean()),
      }),
    },
  )
  .put(
    "/categories/:id",
    async ({ params, body, request, ip, session }) => {
      const cat = await prisma.category.update({
        where: { id: params.id },
        data: {
          ...(body.name != null && { name: body.name }),
          ...(body.slug != null && { slug: body.slug }),
          ...(body.description != null && { description: body.description }),
          ...(body.type != null && { type: body.type }),
          ...(body.sortOrder != null && { sortOrder: body.sortOrder }),
          ...(body.isActive != null && { isActive: body.isActive }),
        },
      });
      await createAuditLog({
        action: "update",
        entity: "Category",
        entityId: cat.id,
        details: JSON.stringify(body),
        ctx: {
          userId: session.user.id,
          ipAddress: ip?.address,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      });
      return cat;
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        description: t.Optional(t.String()),
        type: t.Optional(t.String()),
        sortOrder: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean()),
      }),
    },
  )
  .delete(
    "/categories/:id",
    async ({ params, request, ip, session }) => {
      await prisma.category.delete({ where: { id: params.id } });
      await createAuditLog({
        action: "delete",
        entity: "Category",
        entityId: params.id,
        ctx: {
          userId: session.user.id,
          ipAddress: ip?.address,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      });
      return { success: true };
    },
    { params: t.Object({ id: t.String() }) },
  )
  // Users
  .get("/users", async () => {
    const data = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { reports: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { data };
  })
  // People
  .get("/people", async ({ query }) => {
    const where: Record<string, unknown> = {};
    if (query.famous != null) {
      where.isFamous = query.famous === "true";
    }
    if (query.search?.trim()) {
      const s = `%${query.search.trim()}%`;
      where.OR = [{ firstName: { contains: s } }, { lastName: { contains: s } }];
    }
    const data = await prisma.person.findMany({
      where,
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      take: query.limit ? Number(query.limit) : 100,
    });
    return { data };
  })
  .post(
    "/people",
    async ({ body, request, ip, session }) => {
      const person = await prisma.person.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          nationalCode: body.nationalCode,
          imageUrl: body.imageUrl,
          isFamous: body.isFamous ?? false,
        },
      });
      await createAuditLog({
        action: "create",
        entity: "Person",
        entityId: person.id,
        details: JSON.stringify({ firstName: person.firstName, lastName: person.lastName }),
        ctx: {
          userId: session.user.id,
          ipAddress: ip?.address,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      });
      return person;
    },
    {
      body: t.Object({
        firstName: t.String(),
        lastName: t.String(),
        nationalCode: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        isFamous: t.Optional(t.Boolean()),
      }),
    },
  )
  .put(
    "/people/:id",
    async ({ params, body, request, ip, session }) => {
      const person = await prisma.person.update({
        where: { id: params.id },
        data: {
          ...(body.firstName != null && { firstName: body.firstName }),
          ...(body.lastName != null && { lastName: body.lastName }),
          ...(body.nationalCode != null && { nationalCode: body.nationalCode }),
          ...(body.imageUrl != null && { imageUrl: body.imageUrl }),
          ...(body.isFamous != null && { isFamous: body.isFamous }),
        },
      });
      await createAuditLog({
        action: "update",
        entity: "Person",
        entityId: person.id,
        details: JSON.stringify(body),
        ctx: {
          userId: session.user.id,
          ipAddress: ip?.address,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      });
      return person;
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        nationalCode: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        isFamous: t.Optional(t.Boolean()),
      }),
    },
  )
  // Reports
  .get("/reports", async ({ query }) => {
    const where: Record<string, unknown> = {};
    if (query.status?.trim()) where.status = query.status;
    const page = Number(query.page ?? 1);
    const perPage = Math.min(Number(query.perPage ?? 25), 100);
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: { person: true, user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.report.count({ where }),
    ]);
    return { data, total, page, perPage };
  })
  // Audit logs
  .get("/audit-logs", async ({ query }) => {
    const where: Record<string, unknown> = {};
    if (query.entity?.trim()) where.entity = query.entity;
    if (query.userId?.trim()) where.userId = query.userId;
    const page = Number(query.page ?? 1);
    const perPage = Math.min(Number(query.perPage ?? 50), 100);
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.auditLog.count({ where }),
    ]);
    return { data, total, page, perPage };
  });
