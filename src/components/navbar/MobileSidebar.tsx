// src/components/navbar/MobileSidebar.tsx
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { navLinks } from "@/configs/navbar";
import { User as UserType } from "@/types/user";

type Props = {
  isOpen: boolean;
  user?: UserType | null;
  onClose: () => void;
  onLogout?: () => void;
};

export default function MobileSidebar({
  isOpen,
  user,
  onClose,
  onLogout,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* sidebar */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-72 bg-bluez-tone-3 shadow-md backdrop-blur-md z-60  flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            {/* header */}
            <div className="h-16 px-4 flex items-center justify-between border-b text-congress-50 ">
              <span className="font-bold text-lg">หน้าเมนู</span>
              <button onClick={onClose}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* menu */}
            <div className="flex-1 p-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="text-congress-50 hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* auth section */}
            <div className="p-4 border-t border-congress-50 flex flex-col gap-3">
              {!user ? (
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
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4" />
                    {user.name}
                  </div>
                  <button
                    onClick={() => {
                      onLogout?.();
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
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
