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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await register(
      email,
      password,
      confirmPassword,
      studentCode,
      firstNameTh,
      lastNameTh,
      phoneNumber,
      entryYear
    );
    // console.log(response);
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
          <section className="space-y-4">
            <h2 className="font-bold text-bluez-tone-5 flex items-center gap-2">
              <Lock size={18} />
              ข้อมูลบัญชีผู้ใช้
            </h2>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-bluez-tone-5 ml-1">
                อีเมล (มหาวิทยาลัยเท่านั้น)
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
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-bluez-tone-5 ml-1">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-bluez-tone-1" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-bluez-tone-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-bluez-tone-5 ml-1">
                  ยืนยันรหัสผ่าน
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-bluez-tone-1" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-bluez-tone-1 cursor-pointer"
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
              />
              <Input
                label="ชื่อ (ไทย)"
                placeholder="ชื่อ (ไทย)"
                value={firstNameTh}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setFirstNameTh(e.target.value)
                }
              />
              <Input
                label="นามสกุล (ไทย)"
                placeholder="นามสกุล (ไทย)"
                value={lastNameTh}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setLastNameTh(e.target.value)
                }
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
              value={entryYear}
              onChange={(e) => setEntryYear(e.target.value)}
              className="w-full px-4 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl"
              placeholder="ปีที่เข้าศึกษา"
            />
          </section>

          <button className="w-full bg-congress-300 text-white p-4 rounded-xl hover:bg-congress-400 transition font-semibold flex items-center justify-center gap-3">
            <UserPlus />
            ลงทะเบียนและเริ่มต้นใช้งาน
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
}: {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: { target: { value: SetStateAction<string> } }) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-bluez-tone-5 ml-1">
        {label}
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
          className="w-full pl-12 pr-4 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none"
        />
      </div>
    </div>
  );
}
