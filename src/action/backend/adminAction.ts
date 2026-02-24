/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { getToken } from "../authAction";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export type AdminUser = {
  id: number;
  email: string;
  role: "ADMIN" | "OWNER";
  createdAt: string;
  updatedAt: string;
  profile: { firstNameTh: string; lastNameTh: string } | null;
};

export async function getAdmins(): Promise<AdminUser[]> {
  try {
    const res = await api.get("/api/v1/admin/authorized/admins", {
      headers: authHeader(),
    });
    return res.data.data;
  } catch (error: any) {
    console.error("getAdmins error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "ดึงรายชื่อ Admin ไม่สำเร็จ"
    );
  }
}

export async function createAdmin(email: string) {
  try {
    const res = await api.post(
      "/api/v1/admin/authorized/admins",
      { email },
      { headers: authHeader() }
    );
    return res.data; // { message, data: { id, email, role } }
  } catch (error: any) {
    console.error("createAdmin error:", error.response?.data);
    throw new Error(error.response?.data?.message || "เพิ่ม Admin ไม่สำเร็จ");
  }
}

export async function deleteAdmin(id: number) {
  try {
    const res = await api.delete(`/api/v1/admin/authorized/admins/${id}`, {
      headers: authHeader(),
    });
    return res.data; // { message, data: { id, email, role } }
  } catch (error: any) {
    console.error("deleteAdmin error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "ถอดสิทธิ์ Admin ไม่สำเร็จ"
    );
  }
}
