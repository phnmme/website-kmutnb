"use server";

import axios from "axios";
import { cookies } from "next/headers";

async function getProfile() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/authorized/getprofile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

async function updateProfile(profileData: {
  fullname: string;
  studentCode: string;
  department: string;
  gradYear: number;
  jobField: string;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/authorized/updateprofile`,
      profileData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating profile data:", error);
    return null;
  }
}

export { getProfile, updateProfile };
