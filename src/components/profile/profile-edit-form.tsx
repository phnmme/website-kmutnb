"use client";

import {
  UserCircle,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Briefcase,
  Save,
  X,
} from "lucide-react";
import type React from "react";

interface FormInputProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormInput({ icon, label, name, value, onChange }: FormInputProps) {
  return (
    <div className="group">
      <label
        htmlFor={name}
        className="mb-1.5 flex items-center gap-2 text-sm font-medium text-bluez-tone-3"
      >
        <span className="text-bluez-tone-3">{icon}</span>
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-bluez-tone-2 bg-white px-4 py-2.5 text-bluez-tone-1 transition focus:border-bluez-tone-3 focus:outline-none focus:ring-2 focus:ring-bluez-tone-3/20"
      />
    </div>
  );
}

interface ProfileEditFormProps {
  profile: {
    fullName: string;
    studentId: string;
    major: string;
    graduateYear: string;
    job: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileEditForm({
  profile,
  onChange,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  return (
    <div className="rounded-xl border border-bluez-tone-2/60 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-congress-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-bluez-tone-3">
          {"แก้ไขข้อมูล"}
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          icon={<UserCircle className="h-4 w-4" />}
          label="ชื่อ-นามสกุล"
          name="fullName"
          value={profile.fullName}
          onChange={onChange}
        />
        <FormInput
          icon={<GraduationCap className="h-4 w-4" />}
          label="รหัสนักศึกษา"
          name="studentId"
          value={profile.studentId}
          onChange={onChange}
        />
        <FormInput
          icon={<BookOpen className="h-4 w-4" />}
          label="สาขา"
          name="major"
          value={profile.major}
          onChange={onChange}
        />
        <FormInput
          icon={<CalendarDays className="h-4 w-4" />}
          label="ปีที่จบ"
          name="graduateYear"
          value={profile.graduateYear}
          onChange={onChange}
        />
        <FormInput
          icon={<Briefcase className="h-4 w-4" />}
          label="ตำแหน่งงาน"
          name="job"
          value={profile.job}
          onChange={onChange}
        />
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-bluez-tone-2 bg-transparent px-5 py-2.5 text-sm font-medium text-bluez-tone-4 transition hover:bg-bluez-tone-2/30"
        >
          <X className="h-4 w-4" />
          {"ยกเลิก"}
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-bluez-tone-4 px-5 py-2.5 text-sm font-medium text-bluez-tone-5 shadow-sm transition hover:bg-bluez-tone-1"
        >
          <Save className="h-4 w-4" />
          {"บันทึก"}
        </button>
      </div>
    </div>
  );
}
