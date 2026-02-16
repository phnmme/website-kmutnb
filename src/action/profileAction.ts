/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";

// axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// helper ดึง token จาก localStorage
function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// =======================
// Get Profile (Client-side)
// =======================
async function getProfile() {
  const token = getToken();
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
  const token = getToken();
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
    throw new Error(error.response?.data?.message || "Update profile failed");
  }
}

export { getProfile, updateProfile };
