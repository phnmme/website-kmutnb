// getCurrentUser.ts
"use client";

import { getMe } from "@/action/authAction";
import { User } from "@/types/user";

export async function getCurrentUser(): Promise<User | null> {
  // ตรวจสอบ token จาก localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) return null;

  try {
    const res = await getMe();
    return res?.data || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
