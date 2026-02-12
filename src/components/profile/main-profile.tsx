"use client";

import React, { useState } from "react";
import { ProfileHeader } from "./profile-header";
import { ProfileInfoCard } from "./profile-info-card";
import { ProfileEditForm } from "./profile-edit-form";
import Particles from "../bits/Particles";

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
      <main className="relative z-10  py-8 md:py-16">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          {/* Header card with avatar + name */}
          <ProfileHeader
            fullName={profile.fullName}
            studentId={profile.studentId}
            job={profile.job}
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
