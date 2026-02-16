/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// Login
// =======================
async function login(email: string, password: string) {
  try {
    const response = await api.post("/api/v1/auth/guest/login", {
      email,
      password,
    });

    const token = response.data.data.token;

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: true, // สำคัญสำหรับ Vercel (HTTPS)
      sameSite: "lax",
      path: "/",
    });

    redirect("/");
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

// =======================
// Register
// =======================
async function register(
  email: string,
  password: string,
  confirmPassword: string,
  studentCode: string,
  firstNameTh: string,
  lastNameTh: string,
  phoneNumber: string,
  entryYear: string
) {
  try {
    const response = await api.post("/api/v1/auth/guest/register", {
      email,
      password,
      confirmPassword,
      studentCode,
      firstNameTh,
      lastNameTh,
      phoneNumber,
      entryYear,
    });

    return response.data;
  } catch (error: any) {
    console.error("Register error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Register failed");
  }
}

// =======================
// Get Me (SSR)
// =======================
async function getMe() {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  try {
    const res = await api.get("/api/v1/auth/authorized/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("Get Me error:", error.response?.data);
    return null;
  }
}

// =======================
// Verify Permission
// =======================
async function verify(page: string) {
  const token = (await cookies()).get("token")?.value;

  if (!token) return false;

  try {
    await api.get(`/api/v1/auth/authorized/verify/${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error: any) {
    console.error("Verification error:", error.response?.data);
    return false;
  }
}

export { login, register, getMe, verify };
