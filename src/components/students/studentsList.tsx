"use client";

import { useEffect, useMemo, useState } from "react";
import StudentCard from "./StudentCard";
import { Search, ChevronDown } from "lucide-react";
import Particles from "../bits/Particles";

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

  // ===== Fetch students =====
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/students/guest/getstudentbyyear?year=${selectedYear}`
        );

        const json = await res.json();

        if (selectedYear === "all") {
          setGroups(json);
        } else {
          const students: StudentApi[] = json.data?.students || [];

          setGroups([
            {
              gradYear: Number(selectedYear),
              count: students.length,
              students,
            },
          ]);
        }
      } catch (err) {
        console.error("Fetch students error:", err);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedYear]);

  // ===== Search filter =====
  const filteredGroups = useMemo(() => {
    if (!search) return groups;

    const q = search.toLowerCase();

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
              className="px-4 py-2 rounded-md border text-sm bg-white cursor-pointer hover:bg-gray-100 transition"
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
                className="w-full rounded-xl border bg-gray-50 pl-10 pr-4 py-2.5 text-sm"
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
                className="w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm"
              >
                <option value="all">ทุกปีที่จบ</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    ปี {year}
                  </option>
                ))}
              </select>

              {/* <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
            </div>
          </div>
        </div>

        {/* ===== Loading ===== */}
        {loading && (
          <div className="text-center py-20 text-bluez-tone-5">
            กำลังโหลดข้อมูล...
          </div>
        )}

        {/* ===== Data ===== */}
        {!loading &&
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
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {group.students.length}
                  </span>

                  {/* ดูเพิ่มเติม (แสดงเฉพาะตอน all) */}
                  {selectedYear === "all" && (
                    <button
                      onClick={() => setSelectedYear(group.gradYear)}
                      className="text-sm px-3 py-1 rounded-md bg-bluez-tone-3 text-white hover:bg-bluez-tone-2 cursor-pointer hover:text-bluez-tone-4 transition"
                    >
                      ดูเพิ่มเติม
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
                        fullName:
                          student.firstNameTh + " " + student.lastNameTh,
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

        {!loading && filteredGroups.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            ไม่พบนักศึกษาที่ตรงกับเงื่อนไข
          </div>
        )}
      </div>
    </>
  );
}
