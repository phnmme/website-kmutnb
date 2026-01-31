"use client";

import { useMemo, useState } from "react";
import Marquee from "react-fast-marquee";
import StudentCard from "./StudentCard";
import { Student } from "../../types/studentsList";
import { Search, ChevronDown } from "lucide-react";
import Particles from "../bits/Particles";

type Props = {
  students: Student[];
};

export default function StudentsList({ students }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  const years = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.graduationYear))).sort(
      (a, b) => b - a
    );
  }, [students]);

  const searchFilter = useMemo(
    () => (student: Student) => {
      const q = search.toLowerCase();
      return (
        student.fullName.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.currentOccupation.toLowerCase().includes(q)
      );
    },
    [search]
  );

  const groupedByYear = useMemo(() => {
    return years.map((year) => ({
      year,
      students: students
        .filter((s) => s.graduationYear === year)
        .filter(searchFilter),
    }));
  }, [students, years, searchFilter]);

  const filteredStudents = useMemo(() => {
    if (selectedYear === "all") return [];
    return students
      .filter((s) => s.graduationYear === selectedYear)
      .filter(searchFilter);
  }, [students, selectedYear, searchFilter]);

  return (
    <>
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="min-h-screen px-6 py-10 w-full max-w-7xl mx-auto">
        <div className="mb-12 rounded-2xl bg-bluez-tone-5/60 shadow-md border border-gray-200/50 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อ / รหัสนักศึกษา / อาชีพ"
                className="w-full rounded-xl border border-gray-300 bg-gray-50/70 pl-10 pr-4 py-2.5 text-sm text-gray-700 
        placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50/70 px-4 py-2.5 text-sm text-gray-700 
        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              >
                <option value="all">ทุกปีที่จบ</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    ปีที่จบ {year}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {selectedYear === "all" &&
          groupedByYear.map(
            ({ year, students }) =>
              students.length > 0 && (
                <section key={year} className="">
                  {/* Header */}
                  <div className=" flex items-center gap-4">
                    <div className="h-8 w-1 bg-bluez-tone-5 rounded" />
                    <h2 className="text-xl font-bold text-bluez-tone-5">
                      ปีการศึกษา {year}
                    </h2>
                    <span className="text-sm text-gray-400">
                      ({students.length} คน)
                    </span>
                  </div>

                  <Marquee
                    pauseOnHover
                    speed={40}
                    direction={year % 2 === 0 ? "left" : "right"}
                  >
                    {students.map((student) => (
                      <div key={student.id} className="mr-6 my-10">
                        <StudentCard student={student} />
                      </div>
                    ))}
                  </Marquee>
                </section>
              )
          )}

        {/* ====== เลือกปีเดียว ====== */}
        {selectedYear !== "all" && (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}

            {filteredStudents.length === 0 && (
              <p className="text-gray-400 text-sm">
                ไม่พบนักศึกษาที่ตรงกับเงื่อนไข
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
