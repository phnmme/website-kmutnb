// src/components/navbar/NavbarActions.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User } from "@/types/user";
import {
  LogIn,
  LogOut,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
} from "lucide-react";
import { adminNavLinks } from "@/configs/navbar";

type Props = {
  user?: User | null;
  onLogout?: () => void;
};

export default function NavbarActions({ user, onLogout }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log("User in NavbarActions:", user);
  }, [user]);
  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const isAdmin = user.role === "ADMIN" || user.role === "OWNER";

  return (
    <div className="flex items-center gap-3">
      {/* Profile Link / Admin Dropdown */}
      {isAdmin ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-congress-600 group"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-bluez-tone-5 group-hover:text-bluez-tone-6">
              {user.name}
            </span>
            {/* Badge admin */}
            <span className="text-xs bg-amber-100 text-amber-600 font-semibold px-1.5 py-0.5 rounded-full">
              Admin
            </span>
            <ChevronDown
              className={`w-4 h-4 text-bluez-tone-5 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
              {/* Profile link อยู่ด้านบนสุด */}
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                โปรไฟล์ของฉัน
              </Link>

              <div className="border-t border-gray-100 my-1" />

              <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin Panel
              </p>

              {adminNavLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        // ปกติสำหรับ user ทั่วไป
        <Link
          href="/profile"
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-congress-600 group"
        >
          <div className="w-8 h-8 rounded-full bg-bluez-tone-4 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-bluez-tone-5 group-hover:text-bluez-tone-6">
            {user.name}
          </span>
        </Link>
      )}

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
