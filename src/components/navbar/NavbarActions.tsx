// src/components/navbar/NavbarActions.tsx
"use client";

import Link from "next/link";
import { User } from "@/types/user";
import { LogIn, UserPlus } from "lucide-react";

type Props = {
  user?: User | null;
  onLogout?: () => void;
};

export default function NavbarActions({ user }: Props) {
  if (!user) {
    return (
      <div className="flex gap-3">
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 border hover:bg-bluez-tone-2 hover:text-bluez-tone-1 transition duration-300 rounded-md border-congress-50 text-congress-50"
        >
          <LogIn className="w-4 h-4" />
          เข้าสู่ระบบ
        </Link>
        <Link
          href="/register"
          className="flex items-center gap-2 px-4 py-2 bg-bluez-tone-4 hover:bg-bluez-tone-5 hover:text-bluez-tone-1 duration-300 transition text-white rounded-md"
        >
          <UserPlus className="w-4 h-4" />
          สมัครสมาชิก
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">👤 {user.name}</span>
      <button className="px-3 py-1 rounded-md text-sm border hover:bg-red-50">
        Logout
      </button>
    </div>
  );
}
