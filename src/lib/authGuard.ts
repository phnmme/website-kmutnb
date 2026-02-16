// authGuard.ts
"use client";

import { verify } from "@/action/authAction";

export default async function authGuard(page: string) {
  // ตรวจสอบ token จาก localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    // Redirect ไปหน้า login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }

  try {
    const isAuthorized = await verify(page);

    if (!isAuthorized) {
      // Redirect ไปหน้า login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return false;
    }

    return true;
  } catch (error) {
    console.error("Auth guard error:", error);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }
}
