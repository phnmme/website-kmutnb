// src/action/authGuard.ts
"use client";

import { verify } from "@/action/authAction";

export default async function authGuard(page: string): Promise<boolean> {
  // ── 1. ตรวจ token ──────────────────────────────────────────────────────────
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    redirect("/login");
    return false;
  }

  try {
    const isAuthorized = await verify(page);

    if (!isAuthorized) {
      // มี token แต่ไม่มีสิทธิ์ → ไปหน้า unauthorized แทน login
      // redirect(page === "admin" ? "" : "/login");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Auth guard error:", error);
    localStorage.removeItem("token");
    redirect("/login");
    return false;
  }
}

function redirect(path: string) {
  if (typeof window !== "undefined") {
    window.location.href = path;
  }
}
