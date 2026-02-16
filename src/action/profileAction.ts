/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axios from "axios";
import { cookies } from "next/headers";

// axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// helper ดึง token
async function getToken() {
  return (await cookies()).get("token")?.value;
}

// =======================
// Get Profile (SSR)
// =======================
async function getProfile() {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await api.get("/api/v1/profile/authorized/getprofile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    console.error(
      "Error fetching profile:",
      error.response?.data || error.message
    );
    return null;
  }
}

// =======================
// Update Profile
// =======================
async function updateProfile(profileData: {
  fullname: string;
  studentCode: string;
  department: string;
  gradYear: number;
  jobField: string;
}) {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await api.put(
      "/api/v1/profile/authorized/updateprofile",
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error(
      "Error updating profile:",
      error.response?.data || error.message
    );
    return null;
  }
}

export { getProfile, updateProfile };
