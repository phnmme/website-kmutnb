"use client";

import { UserMainPage } from "@/components/admin";
import authGuard from "@/lib/authGuard";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const init = async () => {
      const isAuth = await authGuard("admin");
      if (!isAuth) return;
      setAuthorized(true);
    };

    init();
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bluez-tone-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin" />
          <p className="text-sm text-white/40">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex items-center justify-center overflow-hidden py-10 pt-26 min-h-screen bg-bluez-tone-4 px-4 md:px-10">
      <UserMainPage />
    </div>
  );
}
