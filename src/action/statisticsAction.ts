/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getStatistics() {
  try {
    const res = await api.get("/api/v1/statistics/guest/getStats");
    return res.data;
  } catch (error: any) {
    console.error(
      "Error fetching statistics:",
      error.response?.data || error.message
    );
    return null;
  }
}

export { getStatistics };
