"use client"; // เพิ่ม - เพราะใช้ authGuard และ getProfile ที่เป็น client-side

import { useEffect, useState } from "react"; // เพิ่ม
import { useRouter } from "next/navigation"; // เพิ่ม
import { getProfile } from "@/action/profileAction";
import { MainProfile } from "@/components/profile";
import authGuard from "@/lib/authGuard";

export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        const isAuth = await authGuard("user");

        if (!isAuth) {
          router.push("/login");
          return;
        }

        const data = await getProfile();

        if (!data || !data.data || !data.data.user) {
          setError("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");
          return;
        }

        setUser(data.data.user);
      } catch (err: any) {
        console.error("Profile page error:", err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bluez-tone-5 mb-4"></div>
          <p className="text-bluez-tone-5">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
            <p className="font-semibold mb-2">เกิดข้อผิดพลาด</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-bluez-tone-3 text-white rounded-lg hover:bg-bluez-tone-2 transition"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
      {user && <MainProfile user={user} />}
    </div>
  );
}
