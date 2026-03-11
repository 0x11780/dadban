import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "better-auth/crypto";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3307,
  user: process.env.DATABASE_USER || "dadban",
  password: process.env.DATABASE_PASSWORD || "dadban_secret",
  database: process.env.DATABASE_NAME || "dadban",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const FIRST_USER_EMAIL = process.env.SEED_FIRST_USER_EMAIL || "admin@example.com";
const FIRST_USER_NAME = process.env.SEED_FIRST_USER_NAME || "Admin";
const FIRST_USER_PASSWORD = process.env.SEED_FIRST_USER_PASSWORD || "Admin123!";

async function main() {
  const existing = await prisma.user.findFirst();
  if (existing) {
    console.log("Users already exist, skipping seed.");
    return;
  }

  const hashedPassword = await hashPassword(FIRST_USER_PASSWORD);
  const user = await prisma.user.create({
    data: {
      name: FIRST_USER_NAME,
      email: FIRST_USER_EMAIL,
      accounts: {
        create: {
          accountId: FIRST_USER_EMAIL,
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  await prisma.admin.create({
    data: { userId: user.id },
  });

  // Seed invite codes
  await prisma.inviteCode.createMany({
    data: [
      { code: "INVITE2024", isActive: true },
      { code: "TEST123", isActive: true },
      { code: "DEMO456", isActive: true },
    ],
    skipDuplicates: true,
  });

  // Seed categories
  await prisma.category.createMany({
    data: [
      { name: "عمومی", slug: "general", type: "report_type", sortOrder: 0 },
      { name: "مالی", slug: "financial", type: "report_type", sortOrder: 1 },
      { name: "اداری", slug: "administrative", type: "report_type", sortOrder: 2 },
    ],
    skipDuplicates: true,
  });

  // Seed famous people
  await prisma.person.createMany({
    data: [
      { firstName: "علی", lastName: "احمدی", isFamous: true },
      { firstName: "محمد", lastName: "رضایی", isFamous: true },
      { firstName: "حسن", lastName: "کریمی", isFamous: true },
      { firstName: "رضا", lastName: "محمدی", isFamous: true },
      { firstName: "مهدی", lastName: "حسینی", isFamous: true },
    ],
  });

  console.log("First user created as admin:", user.email);
  console.log("You can now log in and send invitations.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
