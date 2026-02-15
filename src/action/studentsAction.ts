"use server";

import axios from "axios";

async function getAllYear() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/guest/getallyear`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching students data:", error);
    return null;
  }
}

export async function getStudentsByYear(
  year: string | number,
  skip: number = 0
) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/students/guest/getstudentbyyear?year=${year}&skip=${skip}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching students by year:", error);
    return null;
  }
}

export { getAllYear };
