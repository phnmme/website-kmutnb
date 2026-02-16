// src/components/navbar/NavbarActions.tsx
"use client";

import Link from "next/link";
import { User } from "@/types/user";
import { LogIn, LogOut, UserPlus } from "lucide-react";

type Props = {
  user?: User | null;
  onLogout?: () => void;
};

export default function NavbarActions({ user, onLogout }: Props) {
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
    <div className="flex items-center gap-3">
      {/* Profile Link */}
      <Link
        href="/profile"
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition 
        hover:bg-congress-600 group"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-bluez-tone-4 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        <span className="text-sm font-medium text-bluez-tone-5 group-hover:text-bluez-tone-6">
          {user.name}
        </span>
      </Link>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm border border-red-200 
        text-red-500 hover:bg-red-50 hover:border-red-300 transition"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}
