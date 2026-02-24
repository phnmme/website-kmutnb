/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  UserPlus,
  Trash2,
  Crown,
  X,
  Shield,
  Wifi,
  WifiOff,
  Search,
} from "lucide-react";
import Particles from "@/components/bits/Particles";
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
} from "@/action/backend/adminAction";

export type AdminApi = {
  id: number;
  email: string;
  role: "OWNER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  profile: {
    firstNameTh: string;
    lastNameTh: string;
  };
  lastLoginAt: string | null;
  isOnline: boolean;
};
export default function AdminPage() {
  const [admins, setAdmins] = useState<AdminApi[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const load = async () => {
    const data = await getAdmins();
    // console.log("Admins:", data);
    const mappedData = data.map((admin: any) => ({
      ...admin,
      lastLoginAt: admin.lastLoginAt || null,
      isOnline: admin.isOnline || false,
    }));
    // console.log("Mapped Admins:", mappedData);
    setAdmins(mappedData);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!name || !email) return;
    await createAdmin(email);
    setName("");
    setEmail("");
    setOpenModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    await deleteAdmin(id);
    setDeleteConfirm(null);
  };

  const filtered = admins.filter(
    (a) =>
      a.profile.firstNameTh.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Particles background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={150}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
        />
      </div>

      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-8 sm:px-6 lg:px-10 flex flex-col items-center">
        <div className="w-full max-w-5xl space-y-6">
          {/* ── Header Card ── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-bluez-tone-3/50  border border-white/10 rounded-2xl px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 shrink-0">
                <Shield size={20} className="text-blue-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  จัดการผู้ดูแลระบบ
                </h1>
                <p className="text-xs text-white/40 mt-0.5">
                  {admins.length} บัญชี ·{" "}
                  {admins.filter((a) => a.isOnline).length} ออนไลน์
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="group relative overflow-hidden cursor-pointer flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 w-full sm:w-auto"
            >
              <UserPlus size={16} />
              เพิ่ม Admin
            </button>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "ผู้ดูแลทั้งหมด",
                value: admins.length,
                color: "text-blue-300",
              },
              {
                label: "ออนไลน์",
                value: admins.filter((a) => a.isOnline).length,
                color: "text-emerald-400",
              },
              {
                label: "ออฟไลน์",
                value: admins.length - admins.filter((a) => a.isOnline).length,
                color: "text-slate-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className=" bg-bluez-tone-3/50  border border-white/10 rounded-xl px-4 py-4 text-center"
              >
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-bluez-tone-5 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Search ── */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-bluez-tone-5"
            />
            <input
              type="text"
              placeholder="ค้นหาชื่อหรืออีเมล..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full  bg-bluez-tone-3/50  border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
            />
          </div>

          {/* ── Table (desktop) / Cards (mobile) ── */}

          {/* Desktop table */}
          <div className="hidden md:block  bg-bluez-tone-3/50  border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-xs font-semibold text-bluez-tone-5 uppercase tracking-widest">
                    ชื่อ
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-bluez-tone-5 uppercase tracking-widest">
                    อีเมล
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-bluez-tone-5 uppercase tracking-widest">
                    สถานะ
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-bluez-tone-5 uppercase tracking-widest text-right">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/40 to-indigo-600/40 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                            {admin.profile.firstNameTh.charAt(0)}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black/30 ${
                              admin.isOnline ? "bg-emerald-400" : "bg-slate-500"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm flex items-center gap-2">
                            {admin.profile.firstNameTh}{" "}
                            {admin.profile.lastNameTh}
                            {admin.role === "OWNER" && (
                              <span className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs px-2 py-0.5 rounded-lg">
                                <Crown size={10} /> Owner
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/50">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${
                          admin.isOnline
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-500/15 text-slate-400 border border-slate-500/20"
                        }`}
                      >
                        {admin.isOnline ? (
                          <Wifi size={11} />
                        ) : (
                          <WifiOff size={11} />
                        )}
                        {admin.isOnline ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {deleteConfirm === admin.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-white/50">ยืนยัน?</span>
                          <button
                            onClick={() => handleDelete(admin.id)}
                            className="text-xs bg-red-500/20 cursor-pointer hover:bg-red-500/40 text-red-400 px-2.5 py-1 rounded-lg border border-red-500/20 transition-colors"
                          >
                            ลบ
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs bg-white/5 hover:bg-white/10 cursor-pointer text-white/50 px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(admin.id)}
                          className="opacity-0 group-hover:opacity-100 cursor-pointer text-white/30 hover:border-red-400 hover:border hover:text-red-400 transition-all p-2 rounded-lg hover:bg-red-400/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-white/25 text-sm"
                    >
                      ไม่พบผู้ดูแลระบบ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((admin) => (
              <div
                key={admin.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/40 to-indigo-600/40 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                        {admin.profile.firstNameTh.charAt(0)}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white/5 ${
                          admin.isOnline ? "bg-emerald-400" : "bg-slate-500"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm flex items-center flex-wrap gap-1.5">
                        {admin.profile.firstNameTh} {admin.profile.lastNameTh}
                        {admin.role === "OWNER" && (
                          <span className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs px-2 py-0.5 rounded-lg">
                            <Crown size={10} /> Owner
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">
                        {admin.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg ${
                        admin.isOnline
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-500/15 text-slate-400 border border-slate-500/20"
                      }`}
                    >
                      {admin.isOnline ? (
                        <Wifi size={10} />
                      ) : (
                        <WifiOff size={10} />
                      )}
                      {admin.isOnline ? "Online" : "Offline"}
                    </span>
                    {admin.role !== "OWNER" && (
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="text-white/30 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-white/25 text-sm">
                ไม่พบผู้ดูแลระบบ
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute cursor-pointer right-4 top-4 text-white/30 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <UserPlus size={18} className="text-blue-300" />
              </div>
              <h2 className="text-lg font-bold text-white">เพิ่ม Admin ใหม่</h2>
            </div>

            <div className="space-y-4">
              <ModalInput
                label="ชื่อ"
                placeholder="ชื่อ-นามสกุล"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
              <ModalInput
                label="อีเมล"
                placeholder="email@example.com"
                // icon={<Mail size={15} />}
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setOpenModal(false)}
                  className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold transition-colors border border-white/10"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-blue-500 cursor-pointer hover:bg-blue-400 active:scale-95 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25"
                >
                  <UserPlus size={16} />
                  เพิ่ม Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ModalInput({ label, placeholder, icon, value, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25">
            {icon}
          </div>
        )}
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 outline-none focus:border-blue-400/60 focus:bg-white/8 transition-all`}
        />
      </div>
    </div>
  );
}
