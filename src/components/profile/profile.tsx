"use client";

import { User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function MainProfile() {
  const [isEdit, setIsEdit] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "นางสาวกอไก่ ขอไข่",
    studentId: "1234567890",
    major: "เทคโนโลยีสารสนเทศเพื่อการจัดการ",
    graduateYear: "2565",
    job: "Software Eng",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("บันทึกข้อมูล:", profile);
    // TODO: เรียก API update profile
    setIsEdit(false);
  };

  return (
    <div className="flex flex-col items-center bg-bluez-tone-1/30 py-8 px-10 rounded-2xl drop-shadow-xl w-full max-w-2xl my-20">
      <h1 className="text-3xl font-bold text-bluez-tone-5 mb-6">
        {isEdit ? "แก้ไขโปรไฟล์" : "โปรไฟล์นักศึกษา"}
      </h1>

      {/* รูปโปรไฟล์ (ยังไม่แก้ไข) */}
      <Image
        src="https://img5.pic.in.th/file/secure-sv1/kmutnb.png"
        alt="Profile Picture"
        width={150}
        height={150}
        className="rounded-md border-2 border-bluez-tone-3 bg-white p-2 mb-6"
      />

      <div className="flex gap-2">
        <User className="text-white" />
        <p className="text-green-500">ข้อมูลส่วนตัว</p>
      </div>
      {/* ===== VIEW MODE ===== */}
      {!isEdit && (
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-bluez-tone-5">
            {profile.fullName}
          </h2>
          <p className="text-bluez-tone-5">รหัสนักศึกษา: {profile.studentId}</p>
          <p className="text-bluez-tone-5">สาขา: {profile.major}</p>
          <p className="text-bluez-tone-5">ปีที่จบ: {profile.graduateYear}</p>
          <p className="text-bluez-tone-5">ตำแหน่งงาน: {profile.job}</p>

          <button
            onClick={() => setIsEdit(true)}
            className="mt-6 px-6 py-2 rounded-lg bg-bluez-tone-3 cursor-pointer hover:text-black duration-300 text-white font-semibold hover:bg-bluez-tone-2 transition"
          >
            แก้ไขโปรไฟล์
          </button>
        </div>
      )}

      {/* ===== EDIT MODE ===== */}
      {isEdit && (
        <div className="w-full space-y-4">
          <Input
            label="ชื่อ-นามสกุล"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />

          <Input
            label="รหัสนักศึกษา"
            name="studentId"
            value={profile.studentId}
            onChange={handleChange}
          />

          <Input
            label="สาขา"
            name="major"
            value={profile.major}
            onChange={handleChange}
          />

          <Input
            label="ปีที่จบ"
            name="graduateYear"
            value={profile.graduateYear}
            onChange={handleChange}
          />
          <Input
            label="ตำแหน่งงาน"
            name="job"
            value={profile.job}
            onChange={handleChange}
          />

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-bluez-tone-4 text-white font-semibold hover:bg-bluez-tone-5 transition"
            >
              บันทึก
            </button>
            <button
              onClick={() => setIsEdit(false)}
              className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-bluez-tone-5">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bluez-tone-3"
      />
    </div>
  );
}
