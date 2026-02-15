"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function login(email: string, password: string) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/guest/login`,
    { email, password }
  );
  (await cookies()).set("token", response.data.data.token, {
    httpOnly: true,
    path: "/",
  });
  redirect("/");
}

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
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/guest/register`,
    {
      email,
      password,
      confirmPassword,
      studentCode,
      firstNameTh,
      lastNameTh,
      phoneNumber,
      entryYear,
    }
  );
  return response.data;
}
async function getMe() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/authorized/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
async function verify(page: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return false;
  }
  try {
    await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/authorized/verify/${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
}

export { login, register, getMe, verify };
