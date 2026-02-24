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

export type Log = {
  id: number;
  action: string;
  details: string | null;
  userId: number | null;
  user: { id: number; email: string; role: string } | null;
  createdAt: string;
};

export type LogPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetLogsParams = {
  search?: string;
  action?: string;
  userId?: number;
  page?: number;
  limit?: number;
};

export async function getLogs(
  params: GetLogsParams = {}
): Promise<{ data: Log[]; pagination: LogPagination }> {
  try {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.action) query.set("action", params.action);
    if (params.userId) query.set("userId", String(params.userId));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const res = await api.get(
      `/api/v1/log/authorized/logs?${query.toString()}`,
      {
        headers: authHeader(),
      }
    );
    return { data: res.data.data, pagination: res.data.pagination };
  } catch (error: any) {
    console.error("getLogs error:", error.response?.data);
    throw new Error(error.response?.data?.message || "ดึง Log ไม่สำเร็จ");
  }
}

export async function getLogActions(): Promise<string[]> {
  try {
    const res = await api.get("/api/v1/log/authorized/logs/actions", {
      headers: authHeader(),
    });
    return res.data.data; // string[]
  } catch (error: any) {
    console.error("getLogActions error:", error.response?.data);
    throw new Error(error.response?.data?.message || "ดึง Action ไม่สำเร็จ");
  }
}
export async function deleteLog(id: number) {
  try {
    const res = await api.delete(`/api/v1/log/authorized/logs/${id}`, {
      headers: authHeader(),
    });
    return res.data; // { message }
  } catch (error: any) {
    console.error("deleteLog error:", error.response?.data);
    throw new Error(error.response?.data?.message || "ลบ Log ไม่สำเร็จ");
  }
}
