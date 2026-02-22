/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // เพิ่ม

import { useEffect, useState } from "react"; // เพิ่ม
import { StudentsList } from "@/components/students";
import { getAllYear } from "@/action/studentsAction";

export default function StudentsPage() {
  // ลบ async
  const [years, setYears] = useState<number[]>([]); // เพิ่ม
  const [loading, setLoading] = useState(true); // เพิ่ม
  const [error, setError] = useState(""); // เพิ่ม

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await getAllYear();

        if (!res || !res.data || !res.data.years) {
          setError("ไม่สามารถโหลดข้อมูลปีการศึกษาได้");
          return;
        }

        const yearsArray = res.data.years || [];
        setYears(yearsArray);
      } catch (err: any) {
        console.error("Error fetching years:", err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bluez-tone-5 mb-4"></div>
          <p className="text-bluez-tone-5">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
            <p className="font-semibold mb-2">เกิดข้อผิดพลาด</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-bluez-tone-3 text-white rounded-lg hover:bg-bluez-tone-2 transition"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden pt-26 min-h-screen bg-bluez-tone-4 px-10">
      <StudentsList years={years} />
    </div>
  );
}
