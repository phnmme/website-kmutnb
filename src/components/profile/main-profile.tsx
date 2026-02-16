"use client";

import React, { useState } from "react";
import { ProfileHeader } from "./profile-header";
import { ProfileInfoCard } from "./profile-info-card";
import { ProfileEditForm } from "./profile-edit-form";
import Particles from "../bits/Particles";
import { updateProfile } from "@/action/profileAction";
import { useRouter } from "next/navigation";

interface prop {
  user: {
    id: number;
    email: string;
    profile: {
      id: number;
      studentCode: string;
      firstNameTh: string;
      lastNameTh: string;
      phoneNumber: string;
      department: string;
      entryYear: number;
      gradYear: number;
      jobField: string | null;
      jobPosition: string | null;
    };
  } | null;
}

export default function MainProfile({ user }: prop) {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // เพิ่ม
  const [error, setError] = useState(""); // เพิ่ม
  const [success, setSuccess] = useState(""); // เพิ่ม

  const [profile, setProfile] = useState({
    fullName:
      user?.profile?.firstNameTh && user?.profile?.lastNameTh // แก้ไข: ป้องกัน "undefined undefined"
        ? `${user.profile.firstNameTh} ${user.profile.lastNameTh}`
        : "ไม่ระบุ",
    studentCode: user?.profile?.studentCode || "ไม่ระบุ",
    department: user?.profile?.department || "ไม่ระบุ",
    gradYear: user?.profile?.gradYear
      ? String(user.profile.gradYear)
      : "ไม่ระบุ", // แก้ไข
    jobField: user?.profile?.jobField || "ไม่ระบุ",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setError(""); // ล้าง error เมื่อมีการแก้ไข
  };

  const handleSave = async () => {
    // Validation
    if (!profile.fullName || profile.fullName === "ไม่ระบุ") {
      setError("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    if (!profile.studentCode || profile.studentCode === "ไม่ระบุ") {
      setError("กรุณากรอกรหัสนักศึกษา");
      return;
    }

    if (!profile.gradYear || profile.gradYear === "ไม่ระบุ") {
      setError("กรุณากรอกปีที่จบการศึกษา");
      return;
    }

    const gradYearNum = parseInt(profile.gradYear);
    if (isNaN(gradYearNum) || gradYearNum < 2500 || gradYearNum > 2600) {
      setError("กรุณากรอกปีที่จบการศึกษาที่ถูกต้อง (2500-2600)");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const profileData = {
      fullname: profile.fullName,
      studentCode: profile.studentCode,
      department: profile.department,
      gradYear: gradYearNum,
      jobField: profile.jobField === "ไม่ระบุ" ? "" : profile.jobField, // แก้ไข: ส่งค่าว่างแทน "ไม่ระบุ"
    };

    try {
      const res = await updateProfile(profileData);

      if (res) {
        setSuccess("อัปเดตโปรไฟล์สำเร็จ");
        setIsEdit(false);

        // Refresh หลังจาก 1 วินาที
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setError("ไม่สามารถอัปเดตโปรไฟล์ได้");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // รีเซ็ตค่ากลับเป็นค่าเดิม
    setProfile({
      fullName:
        user?.profile?.firstNameTh && user?.profile?.lastNameTh
          ? `${user.profile.firstNameTh} ${user.profile.lastNameTh}`
          : "ไม่ระบุ",
      studentCode: user?.profile?.studentCode || "ไม่ระบุ",
      department: user?.profile?.department || "ไม่ระบุ",
      gradYear: user?.profile?.gradYear
        ? String(user.profile.gradYear)
        : "ไม่ระบุ",
      jobField: user?.profile?.jobField || "ไม่ระบุ",
    });
    setError("");
    setSuccess("");
    setIsEdit(false);
  };

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
      <main className="relative z-10 py-8 md:py-16">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          <ProfileHeader
            fullName={
              user?.profile?.firstNameTh && user?.profile?.lastNameTh
                ? `${user.profile.firstNameTh} ${user.profile.lastNameTh}`
                : "ไม่ระบุ"
            }
            studentId={user?.profile?.studentCode || "ไม่ระบุ"}
            job={user?.profile?.jobField || "ไม่ระบุ"}
            isEdit={isEdit}
            onEditClick={() => setIsEdit(true)}
          />

          {/* เพิ่ม: Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* เพิ่ม: Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          {/* Content card: View or Edit */}
          {!isEdit ? (
            <ProfileInfoCard profile={profile} />
          ) : (
            <ProfileEditForm
              profile={profile}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={handleCancel} // เปลี่ยนเป็น handleCancel
              isLoading={isLoading} // เพิ่ม prop (ถ้า ProfileEditForm รองรับ)
            />
          )}
        </div>
      </main>
    </>
  );
}
