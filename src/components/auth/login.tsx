"use client";

import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import Particles from "../bits/Particles";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
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
                className="block w-full pl-12 pr-4 py-3 bg-bluez-tone-3/50 border-1 border-bluez-tone-1 focus:border-bluez-tone-1 focus:bg-white text-[#001f3f] placeholder:text-gray-400 rounded-xl transition-all outline-none"
                placeholder="example@email.com"
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
                className="block  w-full pl-12 pr-12 py-3 border-1 border-bluez-tone-1 bg-bluez-tone-3/50  focus:border-bluez-tone-1 focus:bg-white text-[#001f3f] placeholder:text-gray-400 rounded-xl transition-all outline-none"
                placeholder="••••••••"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-bluez-tone-1 hover:text-[#0075d3] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className=" flex justify-center mt-4 group">
              <div className="  flex items-center  text-congress-50"></div>
              <button className="w-full block bg-congress-300 text-congress-50 p-4 rounded-xl hover:bg-congress-400 transition duration-300 cursor-pointer font-semibold shadow-md">
                <p>
                  <LogIn
                    className="inline mr-3 group-hover:mr-4 transition-all duration-300"
                    size={20}
                  />
                  เข้าสู่ระบบ
                </p>
              </button>
            </div>
          </div>
        </div>
        <div className="relative group">
          <hr className="border-bluez-tone-3 px-40 lg:px-62" />
          {/* <p className="absolute -top-4 left-1/2 -translate-x-1/2 text-congress-300 px-2 text-sm ">
            หรือ-
          </p> */}
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
