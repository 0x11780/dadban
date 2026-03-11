import { Elysia } from "elysia";
import { prisma } from "../db";
import { auth } from "@/lib/auth";

async function getSession(headers: Headers) {
  return auth.api.getSession({ headers });
}

export const meService = new Elysia({ prefix: "/me", aot: false })
  .derive(async ({ request }) => {
    const session = await getSession(request.headers);
    return { session };
  })
  .get("/", async ({ session }) => {
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    const [tokensCount, approvedRequestsCount] = await Promise.all([
      prisma.report.count({ where: { userId: session.user.id } }),
      prisma.report.count({
        where: { userId: session.user.id, status: "accepted" },
      }),
    ]);
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      passkey: "",
      inviteCode: "",
      isActivated: true,
      tokensCount,
      approvedRequestsCount,
    };
  });
