import React from "react";
import {
  GraduationCap,
  BookOpen,
  CalendarDays,
  Briefcase,
  UserCircle,
} from "lucide-react";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl p-3 transition hover:bg-bluez-tone-2/20">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bluez-tone-3/10 text-bluez-tone-3">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-bluez-tone-3">{label}</p>
        <p className="font-medium text-bluez-tone-1">{value}</p>
      </div>
    </div>
  );
}

interface ProfileInfoCardProps {
  profile: {
    fullName: string;
    studentCode: string;
    department: string;
    gradYear: string;
    jobField: string;
  };
}

export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
  return (
    <div className="rounded-xl border border-bluez-tone-2/60 bg-white/85 p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-congress-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-bluez-tone-3">
          {"ข้อมูลส่วนตัว"}
        </h2>
      </div>

      <div className="grid gap-1 sm:grid-cols-2">
        <InfoRow
          icon={<UserCircle className="h-5 w-5" />}
          label="ชื่อ-นามสกุล"
          value={profile.fullName}
        />
        <InfoRow
          icon={<GraduationCap className="h-5 w-5" />}
          label="รหัสนักศึกษา"
          value={profile.studentCode}
        />
        <InfoRow
          icon={<BookOpen className="h-5 w-5" />}
          label="สาขา"
          value={profile.department}
        />
        <InfoRow
          icon={<CalendarDays className="h-5 w-5" />}
          label="ปีที่จบ"
          value={profile.gradYear}
        />
        <InfoRow
          icon={<Briefcase className="h-5 w-5" />}
          label="ตำแหน่งงาน"
          value={profile.jobField}
        />
      </div>
    </div>
  );
}
