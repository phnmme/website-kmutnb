// getCurrentUser.ts
"use client";

import { getMe } from "@/action/authAction";
import { User } from "@/types/user";

export async function getCurrentUser(): Promise<User | null> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) return null;

  try {
    const res = await getMe();

    if (!res?.data) {
      // ✅ throw ออกไปให้ layout.tsx จัดการ
      throw new Error("โทเค็นไม่ถูกต้อง");
    }

    return res.data;
  } catch (error) {
    // re-throw ให้ขึ้นไปถึง caller เสมอ
    throw error;
  }
}
