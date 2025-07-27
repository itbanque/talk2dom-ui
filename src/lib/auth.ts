// lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user || !user.hashedPassword) return null;

        const valid = await bcrypt.compare(credentials!.password, user.hashedPassword);
        return valid ? user : null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

export const getAuthSession = () => getServerSession(authOptions);