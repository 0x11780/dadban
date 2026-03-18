import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3307,
  user: process.env.DATABASE_USER || "daadnegar",
  password: process.env.DATABASE_PASSWORD || "daadnegar_secret",
  database: process.env.DATABASE_NAME || "daadnegar",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });
export { prisma };
