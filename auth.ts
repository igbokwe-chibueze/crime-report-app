import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter an email and password");
          }
  
          // Explicitly cast to string
          const email = credentials.email as string;
          const password = credentials.password as string;
  
          const user = await prisma.user.findUnique({
            where: { email },
          });
  
          if (!user) {
            throw new Error("No user found with this email");
          }
  
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }
  
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role, // Now recognized via the type augmentation
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        if (session?.user) {
          session.user.role = token.role as string;
        }
        return session;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
    session: {
      strategy: "jwt",
    },
})