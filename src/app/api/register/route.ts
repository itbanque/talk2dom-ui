// src/app/api/register/route.ts

import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma"; // 注意：确保你在 lib 目录下已经有 prisma.ts

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  });

  return NextResponse.json({ message: "User registered successfully", user: { email: user.email } });
}