/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // เพิ่ม
import Particles from "../bits/Particles";
import { login } from "@/action/authAction";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // เพิ่ม
  const [error, setError] = useState(""); // เพิ่ม
  const router = useRouter(); // เพิ่ม

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await login(email, password);

      if (response) {
        // Login สำเร็จ - redirect ไปหน้าหลัก
        router.push("/");
        // หรือใช้ window.location.href = "/" ถ้าต้องการ hard refresh
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setIsLoading(false);
    }
  };

  // เพิ่ม: กด Enter เพื่อ login
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="flex flex-col justify-center items-center bg-bluez-tone-1/30 py-8 md:min-w-xl lg:min-w-2xl rounded-2xl drop-shadow-xl ">
        <h1 className="text-3xl font-semibold text-bluez-tone-5 ">
          เข้าสู่ระบบ
        </h1>
        <div className="p-8 space-y-6 w-full">
          {/* เพิ่ม: แสดง error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-bluez-tone-5 ml-1">
              อีเมล
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors group-focus-within:text-bluez-tone-1 text-bluez-tone-1">
                <Mail size={20} />
              </div>
              <input
                type="email"
                className="block w-full pl-12 pr-4 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 focus:border-bluez-tone-1 focus:bg-white text-[#001f3f] placeholder:text-gray-400 rounded-xl transition-all outline-none"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-bluez-tone-5">
                รหัสผ่าน
              </label>
              <a
                href="#"
                className="text-xs font-medium text-bluez-tone-5 hover:underline"
              >
                ลืมรหัสผ่าน?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors group-focus-within:text-bluez-tone-1 text-bluez-tone-1">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="block w-full pl-12 pr-12 py-3 border border-bluez-tone-1 bg-bluez-tone-3/50 focus:border-bluez-tone-1 focus:bg-white text-[#001f3f] placeholder:text-gray-400 rounded-xl transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
              <button
                type="button" // เพิ่ม
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-bluez-tone-1 hover:text-[#0075d3] transition-colors"
                disabled={isLoading} // เพิ่ม
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-center mt-4 group">
              <button
                onClick={handleLogin}
                disabled={isLoading} // เพิ่ม
                className="w-full block bg-congress-300 text-congress-50 p-4 rounded-xl hover:bg-congress-400 transition duration-300 cursor-pointer font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed" // เพิ่ม disabled styles
              >
                <p>
                  <LogIn
                    className="inline mr-3 group-hover:mr-4 transition-all duration-300"
                    size={20}
                  />
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}{" "}
                  {/* เปลี่ยน */}
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="relative group">
          <hr className="border-bluez-tone-3 px-40 lg:px-62" />
        </div>

        <div className="mt-6 flex justify-center items-center space-x-2">
          <p className="text-sm text-bluez-tone-5">ยังไม่มีบัญชีใช่ไหม?</p>

          <a
            href="/register"
            className="text-sm font-semibold text-congress-300 hover:underline"
          >
            สมัครสมาชิก
          </a>
        </div>
      </div>
    </>
  );
}
