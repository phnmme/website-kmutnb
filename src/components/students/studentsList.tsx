/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import StudentCard from "./StudentCard";
import { Search } from "lucide-react";
import Particles from "../bits/Particles";
import { getStudentsByYear } from "@/action/studentsAction"; // เพิ่ม import

type StudentApi = {
  id: number;
  studentCode: string;
  firstNameTh: string;
  lastNameTh: string;
  gradYear: number;
  jobField: string | null;
  jobPosition: string | null;
};

type GroupedStudents = {
  gradYear: number;
  count: number;
  students: StudentApi[];
};

type Props = {
  years: number[];
};

export default function StudentsList({ years }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<GroupedStudents[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // เพิ่ม

  // ===== Fetch students =====
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(""); // ล้าง error ก่อน fetch

      try {
        // ใช้ action function แทน fetch โดยตรง
        const result = await getStudentsByYear(selectedYear, 0);

        if (!result) {
          setError("ไม่สามารถโหลดข้อมูลนักศึกษาได้");
          setGroups([]);
          return;
        }

        if (selectedYear === "all") {
          // API คืนค่าเป็น array ของ GroupedStudents
          setGroups(result.data || result || []);
        } else {
          // API คืนค่าเป็น object ที่มี students array
          const students: StudentApi[] = result.data?.students || [];

          setGroups([
            {
              gradYear: Number(selectedYear),
              count: students.length,
              students,
            },
          ]);
        }
      } catch (err: any) {
        console.error("Fetch students error:", err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedYear]);

  // ===== Search filter =====
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups; // แก้: เช็คว่างด้วย trim()

    const q = search.toLowerCase().trim();

    return groups
      .map((group) => ({
        ...group,
        students: group.students.filter((s) => {
          const fullName = `${s.firstNameTh} ${s.lastNameTh}`.toLowerCase();
          const occupation = (s.jobPosition || s.jobField || "").toLowerCase();

          return (
            fullName.includes(q) ||
            s.studentCode.toLowerCase().includes(q) ||
            occupation.includes(q)
          );
        }),
      }))
      .filter((group) => group.students.length > 0);
  }, [groups, search]);

  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
        />
      </div>

      <div className="relative min-h-screen px-6 py-10 w-full max-w-7xl mx-auto">
        {/* ===== Back to all button ===== */}
        {selectedYear !== "all" && (
          <div className="mb-6">
            <button
              onClick={() => setSelectedYear("all")}
              disabled={loading} // เพิ่ม
              className="px-4 py-2 rounded-md border text-sm bg-white cursor-pointer hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed" // เพิ่ม disabled styles
            >
              ← กลับไปดูทุกปี
            </button>
          </div>
        )}

        {/* ===== Filter ===== */}
        <div className="mb-12 rounded-2xl bg-bluez-tone-5/60 shadow-md border px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหา ชื่อ / รหัส / อาชีพ"
                disabled={loading} // เพิ่ม
                className="w-full rounded-xl border bg-gray-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bluez-tone-3 disabled:opacity-50 disabled:cursor-not-allowed" // เพิ่ม
              />
            </div>

            {/* Select Year */}
            <div className="relative w-full sm:w-48">
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                disabled={loading} // เพิ่ม
                className="w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bluez-tone-3 disabled:opacity-50 disabled:cursor-not-allowed" // เพิ่ม
              >
                <option value="all">ทุกปีที่จบ</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    ปี {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ===== Error Message ===== */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ===== Loading ===== */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bluez-tone-5"></div>
            <p className="mt-4 text-bluez-tone-5">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* ===== Data ===== */}
        {!loading &&
          !error && // เพิ่ม: ไม่แสดงถ้ามี error
          filteredGroups.map((group) => (
            <section key={group.gradYear} className="mb-14">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-bluez-tone-5 rounded" />
                  <h2 className="text-xl font-bold text-bluez-tone-5">
                    ปีการศึกษา {group.gradYear}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {group.students.length} คน
                  </span>

                  {/* ดูเพิ่มเติม (แสดงเฉพาะตอน all) */}
                  {selectedYear === "all" && (
                    <button
                      onClick={() => setSelectedYear(group.gradYear)}
                      className="text-sm px-3 py-1 rounded-md bg-bluez-tone-3 text-white hover:bg-bluez-tone-2 cursor-pointer hover:text-bluez-tone-4 transition"
                    >
                      ดูเพิ่มเติม →
                    </button>
                  )}
                </div>
              </div>

              {/* Grid */}
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {group.students.map((student) => (
                  <div
                    key={student.id}
                    className="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <StudentCard
                      student={{
                        id: student.id,
                        fullName: `${student.firstNameTh} ${student.lastNameTh}`, // เปลี่ยนเป็น template literal
                        studentId: student.studentCode,
                        graduationYear: student.gradYear,
                        currentOccupation:
                          student.jobPosition || student.jobField || "ไม่ระบุ",
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

        {/* ===== No Data ===== */}
        {!loading && !error && filteredGroups.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">
              {search ? "ไม่พบนักศึกษาที่ตรงกับคำค้นหา" : "ไม่มีข้อมูลนักศึกษา"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-sm text-bluez-tone-3 hover:underline"
              >
                ล้างคำค้นหา
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
