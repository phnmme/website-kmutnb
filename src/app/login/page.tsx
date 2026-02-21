// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Login } from "@/components/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // ถ้ามี token แล้ว redirect ไปหน้าหลัก
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // แสดง loading ขณะตรวจสอบ
  if (isChecking) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bluez-tone-5 mb-4"></div>
          <p className="text-bluez-tone-5">กำลังตรวจสอบ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden min-h-screen bg-bluez-tone-4 px-4 md:px-10">
      <Login />
    </div>
  );
}
