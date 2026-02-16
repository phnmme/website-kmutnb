/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// Get all years
// =======================
async function getAllYear() {
  try {
    const res = await api.get("/api/v1/students/guest/getallyear");
    return res.data;
  } catch (error: any) {
    console.error(
      "Error fetching years:",
      error.response?.data || error.message
    );
    return null;
  }
}

// =======================
// Get students by year
// =======================
export async function getStudentsByYear(
  year: string | number,
  skip: number = 0
) {
  try {
    const res = await api.get("/api/v1/students/guest/getstudentbyyear", {
      params: {
        year,
        skip,
      },
    });

    return res.data;
  } catch (error: any) {
    console.error(
      "Error fetching students:",
      error.response?.data || error.message
    );
    return null;
  }
}

export { getAllYear };
