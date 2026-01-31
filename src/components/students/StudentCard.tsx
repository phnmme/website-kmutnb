"use client";

import Image from "next/image";
import { Student } from "../../types/studentsList";

type Props = {
  student: Student;
};

export default function StudentCard({ student }: Props) {
  return (
    <div className="border-gray-300 bg-gray-50/87 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          <Image
            src="https://img5.pic.in.th/file/secure-sv1/kmutnb.png"
            alt={student.fullName}
            width={144}
            height={144}
            className="
              rounded-full object-cover
              w-20 h-20
              sm:w-24 sm:h-24
              md:w-28 md:h-28
              group-hover:w-32 group-hover:h-32
              transition-all duration-300
            "
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
            {student.fullName}
          </h1>

          <p className="text-xs sm:text-sm text-gray-600">
            {student.currentOccupation}
          </p>

          <p className="text-[11px] sm:text-xs text-gray-500">
            รหัสนักศึกษา: {student.studentId}
          </p>

          <p className="text-[11px] sm:text-xs text-gray-500">
            ปีที่จบ: {student.graduationYear}
          </p>
        </div>
      </div>
    </div>
  );
}
