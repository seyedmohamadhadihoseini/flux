// src/auth.ts
import NextAuth from "next-auth";
import { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/lib/definitions";

// 1. تعریف کانفیگ به صورت جداگانه با تایپ صحیح
const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = LoginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // شبیه‌سازی لاگین (بعداً کد دیتابیس جایگزین شود)
          if (email === "test@test.com" && password === "123456") {
            return {
              id: "1",
              name: "کاربر تستی",
              email: email,
              image: "",
            };
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/', 
    error: '/',
  },
 callbacks: {
    // اضافه کردن تایپ ({ session, token })
    async session({ session, token }: { session: any; token: any }) { 
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    // اضافه کردن تایپ ({ token, user })
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);