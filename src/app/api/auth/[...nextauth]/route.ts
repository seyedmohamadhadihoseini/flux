// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // ایمپورت از فایلی که در مرحله ۴ ساختیم

export const { GET, POST } = handlers;