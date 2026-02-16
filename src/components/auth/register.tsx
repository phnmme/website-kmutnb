/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  User,
  Mail,
  Lock,
  IdCard,
  Phone,
  GraduationCap,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation"; // เพิ่ม
import Particles from "../bits/Particles";
import { register } from "@/action/authAction";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [firstNameTh, setFirstNameTh] = useState("");
  const [lastNameTh, setLastNameTh] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [entryYear, setEntryYear] = useState("");

  const [isLoading, setIsLoading] = useState(false); // เพิ่ม
  const [error, setError] = useState(""); // เพิ่ม
  const [success, setSuccess] = useState(""); // เพิ่ม
  const router = useRouter(); // เพิ่ม

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !studentCode ||
      !firstNameTh ||
      !lastNameTh ||
      !phoneNumber ||
      !entryYear
    ) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      // เพิ่ม validation ความยาวรหัสผ่าน
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await register(
        email,
        password,
        confirmPassword,
        studentCode,
        firstNameTh,
        lastNameTh,
        phoneNumber,
        Number(entryYear)
      );

      if (response) {
        setSuccess("ลงทะเบียนสำเร็จ! กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(error.message || "ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
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

      {/* Card */}
      <div className="relative z-10 flex flex-col justify-center items-center bg-bluez-tone-1/30 py-8 md:min-w-xl lg:min-w-3xl rounded-2xl drop-shadow-xl mx-auto">
        <h1 className="text-3xl font-semibold text-bluez-tone-5 mb-2">
          ลงทะเบียน
        </h1>
        <p className="text-bluez-tone-5/70 text-sm mb-6">
          กรุณากรอกข้อมูลเพื่อสร้างบัญชีและอัปเดตฐานข้อมูลนักศึกษา
        </p>

        <form className="p-8 space-y-10 w-full" onSubmit={handleSubmit}>
          {/* เพิ่ม: Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* เพิ่ม: Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          <section className="space-y-4">
            <h2 className="font-bold text-bluez-tone-5 flex items-center gap-2">
              <Lock size={18} />
              ข้อมูลบัญชีผู้ใช้
            </h2>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-bluez-tone-5 ml-1">
                อีเมล (มหาวิทยาลัยเท่านั้น){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-bluez-tone-1" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 focus:bg-white rounded-xl outline-none"
                  placeholder="example@xyz.xyz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading} // เพิ่ม
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-bluez-tone-5 ml-1">
                  รหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-bluez-tone-1" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none"
                    disabled={isLoading} // เพิ่ม
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-bluez-tone-1 cursor-pointer"
                    disabled={isLoading} // เพิ่ม
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-bluez-tone-5 ml-1">
                  ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-bluez-tone-1" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none"
                    disabled={isLoading} // เพิ่ม
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-bluez-tone-1 cursor-pointer"
                    disabled={isLoading} // เพิ่ม
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-bluez-tone-5 flex items-center gap-2">
              <User size={18} />
              ข้อมูลส่วนตัว
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="รหัสนักศึกษา"
                icon={<IdCard />}
                placeholder="รหัสนักศึกษา"
                value={studentCode}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setStudentCode(e.target.value)
                }
                required
                disabled={isLoading} // เพิ่ม
              />
              <Input
                label="ชื่อ (ไทย)"
                placeholder="ชื่อ (ไทย)"
                value={firstNameTh}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setFirstNameTh(e.target.value)
                }
                required
                disabled={isLoading} // เพิ่ม
              />
              <Input
                label="นามสกุล (ไทย)"
                placeholder="นามสกุล (ไทย)"
                value={lastNameTh}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setLastNameTh(e.target.value)
                }
                required
                disabled={isLoading} // เพิ่ม
              />
              <Input
                label="เบอร์โทรศัพท์"
                type="tel"
                icon={<Phone />}
                placeholder="เบอร์โทรศัพท์"
                value={phoneNumber}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setPhoneNumber(e.target.value)
                }
                required
                disabled={isLoading} // เพิ่ม
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-bold text-bluez-tone-5 flex items-center gap-2">
              <GraduationCap size={18} />
              ข้อมูลการศึกษา
            </h2>

            <input
              readOnly
              value="การจัดการเทคโนโลยีสารการผลิตและสารสนเทศ"
              className="w-full px-4 py-3 bg-bluez-tone-3/30 rounded-xl"
              placeholder="สาขาวิชา"
            />
            <input
              type="number"
              required
              value={entryYear}
              onChange={(e) => setEntryYear(e.target.value)}
              className="w-full px-4 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none"
              placeholder="ปีที่เข้าศึกษา (เช่น 2567)"
              disabled={isLoading} // เพิ่ม
              min="2500" // เพิ่ม validation
              max="2600" // เพิ่ม validation
            />
          </section>

          <button
            type="submit"
            disabled={isLoading} // เพิ่ม
            className="w-full bg-congress-300 text-white p-4 rounded-xl hover:bg-congress-400 transition font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed" // เพิ่ม disabled styles
          >
            <UserPlus />
            {isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียนและเริ่มต้นใช้งาน"}
          </button>
        </form>

        <div className="mt-6 flex gap-2 text-sm">
          <span className="text-bluez-tone-5">มีบัญชีอยู่แล้ว?</span>
          <a
            href="/login"
            className="font-semibold text-congress-300 hover:underline"
          >
            เข้าสู่ระบบ
          </a>
        </div>
      </div>
    </>
  );
}

function Input({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false, // เพิ่ม
  disabled = false, // เพิ่ม
}: {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: { target: { value: SetStateAction<string> } }) => void;
  required?: boolean; // เพิ่ม
  disabled?: boolean; // เพิ่ม
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-bluez-tone-5 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-3.5 text-bluez-tone-1">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required} // เพิ่ม
          disabled={disabled} // เพิ่ม
          className="w-full pl-12 pr-4 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed" // เพิ่ม disabled styles
        />
      </div>
    </div>
  );
}
