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

  const [profile, setProfile] = useState({
    fullName:
      user?.profile?.firstNameTh + " " + user?.profile?.lastNameTh || "ไม่ระบุ",
    studentCode: user?.profile?.studentCode || "ไม่ระบุ",
    department: user?.profile?.department || "ไม่ระบุ",
    gradYear: String(user?.profile?.gradYear) || "ไม่ระบุ",
    jobField: user?.profile?.jobField || "ไม่ระบุ",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const profileData = {
      fullname: profile.fullName,
      studentCode: profile.studentCode,
      department: profile.department,
      gradYear: parseInt(profile.gradYear),
      jobField: profile.jobField,
    };
    try {
      const res = await updateProfile(profileData);
      // console.log("Update profile response:", res);
      if (res) {
        setIsEdit(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์");
    }
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
      <main className="relative z-10  py-8 md:py-16">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          <ProfileHeader
            fullName={
              user?.profile?.firstNameTh + " " + user?.profile?.lastNameTh ||
              "ไม่ระบุ"
            }
            studentId={user?.profile?.studentCode || "ไม่ระบุ"}
            job={user?.profile?.jobField || "ไม่ระบุ"}
            isEdit={isEdit}
            onEditClick={() => setIsEdit(true)}
          />

          {/* Content card: View or Edit */}
          {!isEdit ? (
            <ProfileInfoCard profile={profile} />
          ) : (
            <ProfileEditForm
              profile={profile}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={() => setIsEdit(false)}
            />
          )}
        </div>
      </main>
    </>
  );
}
