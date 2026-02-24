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

export type EmploymentSector = "PRIVATE" | "GOVERNMENT" | null;

export type StudentProfile = {
  id: number;
  studentCode: string;
  firstNameTh: string;
  lastNameTh: string;
  phoneNumber: string | null;
  department: string;
  entryYear: number;
  gradYear: number | null;
  jobField: string | null;
  continued_from_coop: boolean;
  employment_sector: EmploymentSector;
};

export type User = {
  id: number;
  email: string;
  role: "USER" | "ADMIN" | "OWNER";
  createdAt: string;
  updatedAt: string;
  profile: StudentProfile | null;
};

export type UserDetail = User & {
  _count: { logs: number; careerReviews: number };
};

export type UserPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetUsersParams = {
  search?: string;
  role?: "USER" | "ADMIN" | "OWNER" | "all";
  hasProfile?: "with" | "without" | "all";
  page?: number;
  limit?: number;
};

export async function getUsers(
  params: GetUsersParams = {}
): Promise<{ data: User[]; pagination: UserPagination }> {
  try {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.role && params.role !== "all") query.set("role", params.role);
    if (params.hasProfile && params.hasProfile !== "all")
      query.set("hasProfile", params.hasProfile);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const res = await api.get(
      `/api/v1/user/authorized/users?${query.toString()}`,
      {
        headers: authHeader(),
      }
    );
    return { data: res.data.data, pagination: res.data.pagination };
  } catch (error: any) {
    console.error("getUsers error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "ดึงรายชื่อ User ไม่สำเร็จ"
    );
  }
}

export async function getUserById(id: number): Promise<UserDetail> {
  try {
    const res = await api.get(`/api/v1/user/authorized/users/${id}`, {
      headers: authHeader(),
    });
    return res.data.data;
  } catch (error: any) {
    console.error("getUserById error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "ดึงข้อมูล User ไม่สำเร็จ"
    );
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await api.delete(`/api/v1/user/authorized/users/${id}`, {
      headers: authHeader(),
    });
    return res.data; // { message }
  } catch (error: any) {
    console.error("deleteUser error:", error.response?.data);
    throw new Error(error.response?.data?.message || "ลบ User ไม่สำเร็จ");
  }
}

export async function resetUserPassword(id: number): Promise<{
  tempPassword: string;
  expiresIn: string;
  userId: number;
  email: string;
}> {
  try {
    const res = await api.post(
      `/api/v1/user/authorized/users/${id}/reset-password`,
      {},
      { headers: authHeader() }
    );
    return res.data.data; // { tempPassword, expiresIn, userId, email }
  } catch (error: any) {
    console.error("resetUserPassword error:", error.response?.data);
    throw new Error(error.response?.data?.message || "รีเซ็ตรหัสผ่านไม่สำเร็จ");
  }
}
