"use client";

import Image from "next/image";
import { Student } from "../../types/studentsList";

type Props = {
  student: Student;
};

export default function StudentCard({ student }: Props) {
  return (
    <div className="group relative rounded-2xl bg-white/90 backdrop-blur shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-5">
      {/* Hover Glow */}
      <div className="absolute inset-0 rounded-2xl bg-bluez-tone-5/0 group-hover:bg-bluez-tone-5/5 transition duration-300 pointer-events-none" />

      <div className="relative flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="mb-4">
          <Image
            src="https://img5.pic.in.th/file/secure-sv1/kmutnb.png"
            alt={student.fullName}
            width={112}
            height={112}
            className="w-24 h-24 rounded-full object-cover border-4 border-bluez-tone-5/20 group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Name */}
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
          {student.fullName}
        </h3>

        {/* Occupation */}
        <p className="mt-1 text-sm text-bluez-tone-3 font-medium line-clamp-2">
          {student.currentOccupation}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 my-3" />

        {/* Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>รหัส: {student.studentId}</p>
          <p>ปีที่จบ: {student.graduationYear}</p>
        </div>
      </div>
    </div>
  );
}
