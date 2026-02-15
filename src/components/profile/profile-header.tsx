"use client";

import Image from "next/image";
import { User, Pencil } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  studentId: string;
  job: string;
  isEdit: boolean;
  onEditClick: () => void;
}

export function ProfileHeader({
  fullName,
  studentId,
  job,
  isEdit,
  onEditClick,
}: ProfileHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-bluez-tone-1 p-6 pb-24 md:pb-6">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[20px] border-bluez-tone-2" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full border-[16px] border-bluez-tone-2" />
        <div className="absolute right-1/4 top-1/2 h-20 w-20 rounded-full border-[10px] border-bluez-tone-3" />
      </div>

      <div className="relative flex flex-col items-center gap-5 md:flex-row md:items-center">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-bluez-tone-3 bg-white p-2 shadow-lg md:h-32 md:w-32">
            <Image
              src="https://img5.pic.in.th/file/secure-sv1/kmutnb.png"
              alt="Profile Picture"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Name + badges */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-balance text-2xl font-bold text-bluez-tone-5 md:text-3xl">
            {fullName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bluez-tone-4 px-3 py-1 text-sm text-bluez-tone-2">
              <User className="h-3.5 w-3.5" />
              {studentId}
            </span>
            <span className="inline-flex items-center rounded-full bg-bluez-tone-3 px-3 py-1 text-sm font-medium text-bluez-tone-5">
              {job}
            </span>
          </div>
        </div>

        {/* Edit button */}
        {!isEdit && (
          <button
            type="button"
            onClick={onEditClick}
            className="absolute bottom-4 right-4 cursor-pointer inline-flex items-center gap-2 rounded-lg bg-bluez-tone-3 px-4 py-2 text-sm font-medium text-bluez-tone-5 transition hover:bg-bluez-tone-2 hover:text-bluez-tone-1 md:static"
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">{"แก้ไขโปรไฟล์"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
