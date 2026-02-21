"use client";

import {
  UserCircle,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Briefcase,
  Save,
  X,
  Building2,
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

interface RadioOption {
  label: string;
  value: string;
}

interface FormRadioGroupProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormRadioGroup({
  icon,
  label,
  name,
  value,
  options,
  onChange,
}: FormRadioGroupProps) {
  return (
    <div className="group">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-bluez-tone-3">
        <span className="text-bluez-tone-3">{icon}</span>
        {label}
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition select-none ${
                isSelected
                  ? "border-bluez-tone-3 bg-bluez-tone-4 text-bluez-tone-5 shadow-sm"
                  : "border-bluez-tone-2 bg-white text-bluez-tone-3 hover:bg-bluez-tone-2/30"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={onChange}
                className="sr-only"
              />
              <span
                className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition ${
                  isSelected
                    ? "border-bluez-tone-5 bg-bluez-tone-5"
                    : "border-bluez-tone-3 bg-white"
                }`}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-bluez-tone-4" />
                )}
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

interface ProfileEditFormProps {
  profile: {
    fullName: string;
    studentCode: string;
    department: string;
    gradYear: string;
    jobField: string;
    continuedFromCoop: boolean;
    employmentSector: string | null;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function ProfileEditForm({
  profile,
  onChange,
  onSave,
  onCancel,
  isLoading,
}: ProfileEditFormProps) {
  const hasJobField = profile.jobField.trim().length > 0;

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
          name="studentCode"
          value={profile.studentCode}
          onChange={onChange}
        />
        <FormInput
          icon={<BookOpen className="h-4 w-4" />}
          label="สาขา"
          name="department"
          value={profile.department}
          onChange={onChange}
        />
        <FormInput
          icon={<CalendarDays className="h-4 w-4" />}
          label="ปีที่จบ"
          name="gradYear"
          value={profile.gradYear}
          onChange={onChange}
        />
        <FormInput
          icon={<Briefcase className="h-4 w-4" />}
          label="ตำแหน่งงาน"
          name="jobField"
          value={profile.jobField}
          onChange={onChange}
        />
      </div>

      {/* Conditional radio fields — shown only when jobField is filled */}
      {hasJobField && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 border-t border-bluez-tone-2/60 pt-5">
          <FormRadioGroup
            icon={<GraduationCap className="h-4 w-4" />}
            label="ทำงานต่อจากสหกิจหรือไม่"
            name="continuedFromCoop"
            value={profile.continuedFromCoop ? "true" : "false"}
            options={[
              { label: "ใช่", value: "true" },
              { label: "ไม่ใช่", value: "false" },
            ]}
            onChange={onChange}
          />
          <FormRadioGroup
            icon={<Building2 className="h-4 w-4" />}
            label="ประเภทองค์กร"
            name="employmentSector"
            value={profile.employmentSector ?? ""}
            options={[
              { label: "เอกชน", value: "PRIVATE" },
              { label: "รัฐบาล", value: "GOVERNMENT" },
            ]}
            onChange={onChange}
          />
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center cursor-pointer gap-2 rounded-lg border border-bluez-tone-2 bg-transparent px-5 py-2.5 text-sm font-medium text-bluez-tone-4 transition hover:bg-bluez-tone-2/30"
        >
          <X className="h-4 w-4" />
          {"ยกเลิก"}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isLoading}
          className="inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed justify-center cursor-pointer gap-2 rounded-lg bg-bluez-tone-4 px-5 py-2.5 text-sm font-medium text-bluez-tone-5 shadow-sm transition hover:bg-bluez-tone-1"
        >
          <Save className="h-4 w-4" />
          {isLoading ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>
    </div>
  );
}
