// src/lib/getCurrentUser.ts
import { cookies } from "next/headers";
import { getMe } from "@/action/authAction";
import { User } from "@/types/user";

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const res = await getMe();
    return res.data;
  } catch (error) {
    return null;
  }
}
