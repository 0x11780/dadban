import { Elysia, t } from "elysia";
import { prisma } from "../db";

export const constantsService = new Elysia({ prefix: "/constants", aot: false })
  .get("/categories", async () => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return categories;
  })
  .get("/invite-codes", async () => {
    const codes = await prisma.inviteCode.findMany({
      where: { isActive: true },
    });
    return codes.map((c) => ({ code: c.code, isActive: c.isActive }));
  });
