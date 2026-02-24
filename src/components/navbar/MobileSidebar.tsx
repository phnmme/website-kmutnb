// src/components/navbar/MobileSidebar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LogIn,
  UserPlus,
  LogOut,
  User,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { navLinks, authNavLinks, adminNavLinks } from "@/configs/navbar";
import { User as UserType } from "@/types/user";

type Props = {
  isOpen: boolean;
  user?: UserType | null;
  loading?: boolean;
  onClose: () => void;
  onLogout?: () => void;
};

export default function MobileSidebar({
  isOpen,
  user,
  loading = false,
  onClose,
  onLogout,
}: Props) {
  const [adminExpanded, setAdminExpanded] = useState(false);
  const isAdmin = user?.role === "ADMIN" || user?.role === "OWNER";
  const links = user ? authNavLinks : navLinks;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-72 bg-bluez-tone-3 shadow-md backdrop-blur-md z-60 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            {/* Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b text-congress-50">
              <span className="font-bold text-lg">หน้าเมนู</span>
              <button onClick={onClose} aria-label="ปิดเมนู">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="text-congress-50 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Admin Section ใน nav (เฉพาะ admin) */}
              {isAdmin && (
                <div className="mt-2">
                  <div className="border-t border-congress-50/30 pt-3 mb-2">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin Panel
                    </span>
                  </div>

                  {/* Toggle Accordion */}
                  <button
                    onClick={() => setAdminExpanded((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:bg-amber-500/20 transition"
                  >
                    <span className="text-sm font-medium">เมนูผู้ดูแลระบบ</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        adminExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {adminExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 flex flex-col gap-1 pl-2">
                          {adminNavLinks.map(({ label, href, icon: Icon }) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={onClose}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-200 hover:bg-amber-500/20 hover:text-amber-100 transition"
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Auth Section */}
            <div className="p-4 border-t border-congress-50/40 flex flex-col gap-3">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-10 bg-congress-50/20 rounded-md animate-pulse" />
                  <div className="h-10 bg-congress-50/20 rounded-md animate-pulse" />
                </div>
              ) : !user ? (
                <>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 border hover:bg-bluez-tone-2 hover:text-bluez-tone-1 transition duration-300 rounded-md border-congress-50 text-congress-50"
                  >
                    <LogIn className="w-4 h-4" />
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 bg-bluez-tone-4 hover:bg-bluez-tone-5 hover:text-bluez-tone-1 duration-300 transition text-white rounded-md"
                  >
                    <UserPlus className="w-4 h-4" />
                    สมัครสมาชิก
                  </Link>
                </>
              ) : (
                <>
                  {/* User Info Card */}
                  <div
                    className={`px-3 py-2 rounded-md ${
                      isAdmin
                        ? "bg-amber-500/10 border border-amber-400/30"
                        : "bg-congress-50/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-congress-50">
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            isAdmin ? "bg-amber-500" : "bg-bluez-tone-4"
                          }`}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate">
                          {user.name || "ผู้ใช้ไม่ระบุชื่อ"}
                        </span>
                      </div>

                      {/* Admin Badge */}
                      {isAdmin && (
                        <span className="flex items-center gap-1 text-xs bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-congress-50/70 mt-1 truncate pl-9">
                      {user.email}
                    </p>
                  </div>

                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 border border-congress-50 text-congress-50 rounded-md hover:bg-bluez-tone-2 hover:text-bluez-tone-1 transition duration-300"
                  >
                    <User className="w-4 h-4" />
                    โปรไฟล์
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      onLogout?.();
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-400 rounded-md hover:bg-red-50 hover:text-red-600 transition duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                  </button>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
