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

// Helper function to get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Helper function to set token in localStorage
const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

// Helper function to remove token from localStorage
const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

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
    setToken(token);

    return response.data;
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
  entryYear: number
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
// Get Me (Client-side)
// =======================
async function getMe() {
  const token = getToken();

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
  const token = getToken();

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

// =======================
// Logout
// =======================
function logout() {
  removeToken();
}

export { login, register, getMe, verify, logout, getToken };
