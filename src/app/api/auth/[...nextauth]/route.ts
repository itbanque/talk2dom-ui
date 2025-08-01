import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Handler for both GET and POST
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };