import { NextResponse } from "next/server";
import { hashPassword } from "better-auth/crypto";

export async function POST(request: Request) {
  const { prisma } = await import("@/server/db");
  const secret = request.headers.get("x-bootstrap-secret");
  if (secret !== process.env.BOOTSTRAP_SECRET || !process.env.BOOTSTRAP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.user.findFirst();
  if (existing) {
    return NextResponse.json({ error: "Users already exist" }, { status: 400 });
  }

  const body = await request.json();
  const { email, name, password } = body as { email?: string; name?: string; password?: string };
  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name: name || email.split("@")[0],
      email,
      accounts: {
        create: {
          accountId: email,
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  return NextResponse.json({ success: true, userId: user.id });
}
