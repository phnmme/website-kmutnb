"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Users,
  Eye,
  EyeOff,
  Trash2,
  KeyRound,
  Copy,
  Check,
  X,
  Calendar,
  Clock,
  RefreshCw,
  AlertTriangle,
  GraduationCap,
  Phone,
  Building2,
  Hash,
  ChevronRight,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import {
  getUsers,
  getUserById,
  deleteUser,
  resetUserPassword,
} from "@/action/backend/usersAction";
import type {
  User,
  UserDetail,
  GetUsersParams,
} from "@/action/backend/usersAction";
import Particles from "../bits/Particles";

// ─── Types / Helpers ──────────────────────────────────────────────────────────

type RoleFilter = "USER" | "ADMIN" | "all";
type ProfileFilter = "all" | "with" | "without";

const SECTOR_LABEL: Record<string, string> = {
  GOVERNMENT: "ราชการ / รัฐวิสาหกิจ",
  PRIVATE: "เอกชน",
  OWN_BUSINESS: "ธุรกิจส่วนตัว",
  NOT_EMPLOYED: "ยังไม่ได้ทำงาน",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชม. ที่แล้ว`;
  return `${Math.floor(h / 24)} วันที่แล้ว`;
}

// ─── MetaChip ─────────────────────────────────────────────────────────────────

function MetaChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 min-w-0">
      <div className="flex items-center gap-1 text-white/25 text-[10px] uppercase tracking-wider mb-1">
        {icon}
        {label}
      </div>
      <div className="text-xs text-white/70 font-medium truncate">{value}</div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function UserMainPage() {
  // ── List state ──────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  // ── Filter state ────────────────────────────────────────────────────────────
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [profileFilter, setProfileFilter] = useState<ProfileFilter>("all");

  // ── Loading / UI ────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Temp password ───────────────────────────────────────────────────────────
  const [tempPassMap, setTempPassMap] = useState<Record<number, string>>({});
  const [showPassMap, setShowPassMap] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // ── Confirm states ──────────────────────────────────────────────────────────
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [resetId, setResetId] = useState<number | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // ── Toast ───────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Debounce keyword 400ms ───────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [keyword]);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [roleFilter, profileFilter]);

  // ── Fetch list ───────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetUsersParams = {
        search: debouncedKeyword || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        hasProfile: profileFilter !== "all" ? profileFilter : undefined,
        page,
        limit: LIMIT,
      };
      const res = await getUsers(params);
      setUsers(res.data);
      setTotalUsers(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      showToast(err.message || "ดึงข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, roleFilter, profileFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Fetch detail ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedId == null) {
      setSelectedDetail(null);
      return;
    }
    setDetailLoading(true);
    getUserById(selectedId)
      .then(setSelectedDetail)
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: totalUsers,
      admin: users.filter((u) => u.role === "ADMIN").length,
      noProfile: users.filter((u) => !u.profile).length,
    }),
    [users, totalUsers]
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleReset = async (id: number) => {
    setResetLoading(true);
    try {
      const res = await resetUserPassword(id);
      setTempPassMap((p) => ({ ...p, [id]: res.tempPassword }));
      setResetId(null);
      showToast("สร้าง Temp Password สำเร็จ");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setResetLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      await deleteUser(id);
      setDeleteId(null);
      if (selectedId === id) setSelectedId(null);
      showToast("ลบบัญชีสำเร็จ");
      fetchUsers();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCopy = (id: number) => {
    navigator.clipboard.writeText(tempPassMap[id] ?? "");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasFilter = keyword || roleFilter !== "all" || profileFilter !== "all";

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={150}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
        />
      </div>
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-80 rounded-full bg-sky-500/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/8 blur-3xl" />
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success"
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/20 border-red-500/30 text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <Check size={15} />
          ) : (
            <AlertTriangle size={15} />
          )}
          {toast.msg}
        </div>
      )}

      <div className="relative z-10 min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-5">
          {/* ── Header ─────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-bluez-tone-3/50 border border-white/10 rounded-2xl px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0">
                <Users size={20} className="text-sky-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  จัดการผู้ใช้งาน
                </h1>
                <p className="text-xs text-white/40 mt-0.5">
                  ดูข้อมูล · ลบบัญชี · รีเซ็ตรหัสผ่าน
                </p>
              </div>
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center cursor-pointer justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all w-full sm:w-auto disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              รีเฟรช
            </button>
          </div>

          {/* ── Stats ──────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "ผู้ใช้ทั้งหมด",
                value: stats.total,
                color: "text-white",
              },
              { label: "Admin", value: stats.admin, color: "text-sky-400" },
              {
                label: "ไม่มีโปรไฟล์",
                value: stats.noProfile,
                color: "text-amber-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-bluez-tone-3/50  border border-white/10 rounded-xl px-4 py-4 text-center"
              >
                <div className={`text-2xl font-bold ${s.color}`}>
                  {loading ? "—" : s.value}
                </div>
                <div className="text-xs text-bluez-tone-5 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Filters ────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bluez-tone-5 pointer-events-none"
              />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="ค้นหาอีเมล, ชื่อ, รหัสนักศึกษา..."
                className="w-full bg-bluez-tone-3/50 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-sky-400/50 focus:bg-white/10 transition-all"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
              className="appearance-none bg-bluez-tone-3/50  border border-white/10 rounded-xl px-4 py-2.5 text-sm text-bluez-tone-5 outline-none focus:border-sky-400/50 transition-all cursor-pointer min-w-[130px]"
            >
              <option
                value="all"
                className="bg-bluez-tone-2 text-black cursor-pointer"
              >
                ทุก Role
              </option>
              <option
                value="USER"
                className="bg-bluez-tone-2 text-black cursor-pointer"
              >
                User
              </option>
              <option
                value="ADMIN"
                className="bg-bluez-tone-2 text-black cursor-pointer"
              >
                Admin
              </option>
            </select>
            <select
              value={profileFilter}
              onChange={(e) =>
                setProfileFilter(e.target.value as ProfileFilter)
              }
              className="appearance-none bg-bluez-tone-3/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-bluez-tone-5 outline-none focus:border-sky-400/50 transition-all cursor-pointer min-w-[150px]"
            >
              <option
                value="all"
                className="bg-bluez-tone-2 text-black cursor-pointer"
              >
                ทุกโปรไฟล์
              </option>
              <option
                value="with"
                className="bg-bluez-tone-2 text-black cursor-pointer"
              >
                มีโปรไฟล์
              </option>
              <option
                value="without"
                className="bg-bluez-tone-2 text-black cursor-pointer"
              >
                ไม่มีโปรไฟล์
              </option>
            </select>
            {hasFilter && (
              <button
                onClick={() => {
                  setKeyword("");
                  setRoleFilter("all");
                  setProfileFilter("all");
                }}
                className="flex items-center gap-1.5 text-sm text-bluez-tone-5 cursor-pointer hover:text-white border border-white/10 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all shrink-0"
              >
                <X size={14} /> ล้าง
              </button>
            )}
          </div>

          {/* ── Result count ───────────────────────── */}
          <div className="text-xs text-white/30 px-1">
            {loading
              ? "กำลังโหลด..."
              : `แสดง ${users.length} จาก ${totalUsers} บัญชี`}
          </div>

          {/* ── Layout ─────────────────────────────── */}
          <div
            className={`flex gap-4 items-start ${
              selectedId ? "flex-col lg:flex-row" : ""
            }`}
          >
            {/* User List */}
            <div
              className={`bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all ${
                selectedId ? "w-full lg:w-1/2 xl:w-2/5" : "w-full"
              }`}
            >
              <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/10 bg-bluez-tone-3/50">
                {["ผู้ใช้", "Role", "อัปเดต", ""].map((h) => (
                  <div
                    key={h}
                    className="text-xs font-semibold text-bluez-tone-5 uppercase tracking-widest"
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Skeleton */}
              {loading && users.length === 0 ? (
                <div className="divide-y divide-white/[0.06]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-3.5"
                    >
                      <div className="w-9 h-9 rounded-xl bg-bluez-tone-2/50 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-bluez-tone-2/50 rounded animate-pulse w-1/3" />
                        <div className="h-2.5 bg-bluez-tone-2/30 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="py-16 text-center text-white/25 text-sm">
                  ไม่พบผู้ใช้งาน
                </div>
              ) : (
                <div className="divide-y divide-black/10 ">
                  {users.map((u) => {
                    const isSelected = selectedId === u.id;
                    const fullName = u.profile
                      ? `${u.profile.firstNameTh} ${u.profile.lastNameTh}`
                      : null;
                    return (
                      <div
                        key={u.id}
                        onClick={() => setSelectedId(isSelected ? null : u.id)}
                        className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer bg-bluez-tone-3/50 text-black cursor-pointer  hover:bg-white/[0.05] transition-colors group ${
                          isSelected
                            ? "bg-sky-500/10 border-l-2 border-sky-400"
                            : ""
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/30 to-indigo-600/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
                          {(fullName ?? u.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-white truncate">
                              {fullName ?? "—"}
                            </span>
                            {u.role === "ADMIN" && (
                              <span className="text-[10px] bg-sky-400/20 text-sky-300 border border-sky-400/25 px-1.5 py-0.5 rounded-md shrink-0">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/40 truncate">
                            {u.email}
                          </div>
                          {u.profile && (
                            <div className="text-[10px] text-white/25 mt-0.5">
                              {u.profile.studentCode} · ปี {u.profile.entryYear}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!u.profile && (
                            <span className="text-[10px] bg-amber-400/15 text-amber-300 border border-amber-400/20 px-1.5 py-0.5 rounded-md hidden sm:block">
                              ไม่มีโปรไฟล์
                            </span>
                          )}
                          <span className="text-xs text-white/25 hidden md:block whitespace-nowrap">
                            {timeAgo(u.updatedAt)}
                          </span>
                          <ChevronRight
                            size={14}
                            className={`text-white/20 transition-transform ${
                              isSelected
                                ? "rotate-90 text-sky-400"
                                : "group-hover:translate-x-0.5"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-bluez-tone-3/50 text-black cursor-pointer px-5 py-3.5 border-t border-white/10">
                  <span className="text-xs text-bluez-tone-5">
                    หน้า {page} / {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-bluez-tone-5 hover:text-white hover:bg-white/10 disabled:opacity-25 transition-all"
                    >
                      ก่อนหน้า
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages || loading}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-bluez-tone-5 cursor-pointer hover:text-white hover:bg-white/10 disabled:opacity-25 transition-all"
                    >
                      ถัดไป
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Detail Drawer */}
            {selectedId && (
              <div className="w-full lg:flex-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.03]">
                  {detailLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-3.5 w-32 bg-white/10 rounded animate-pulse" />
                        <div className="h-2.5 w-48 bg-white/5 rounded animate-pulse" />
                      </div>
                    </div>
                  ) : selectedDetail ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-indigo-600/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                        {(selectedDetail.profile
                          ? `${selectedDetail.profile.firstNameTh} ${selectedDetail.profile.lastNameTh}`
                          : selectedDetail.email
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {selectedDetail.profile
                            ? `${selectedDetail.profile.firstNameTh} ${selectedDetail.profile.lastNameTh}`
                            : "ไม่มีโปรไฟล์"}
                        </div>
                        <div className="text-xs text-white/40">
                          {selectedDetail.email}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-white/25 cursor-pointer hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Drawer Body */}
                {detailLoading ? (
                  <div className="p-5 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-white/5 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : selectedDetail ? (
                  <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Account Info */}
                    <section>
                      <div className="text-xs text-white/30 uppercase tracking-wider mb-2.5">
                        ข้อมูลบัญชี
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <MetaChip
                          icon={<Hash size={10} />}
                          label="User ID"
                          value={`#${selectedDetail.id}`}
                        />
                        <MetaChip
                          icon={<ShieldCheck size={10} />}
                          label="Role"
                          value={selectedDetail.role}
                        />
                        <MetaChip
                          icon={<Calendar size={10} />}
                          label="สร้างเมื่อ"
                          value={new Date(
                            selectedDetail.createdAt
                          ).toLocaleDateString("th-TH")}
                        />
                        <MetaChip
                          icon={<Clock size={10} />}
                          label="อัปเดตล่าสุด"
                          value={timeAgo(selectedDetail.updatedAt)}
                        />
                        <MetaChip
                          icon={<Hash size={10} />}
                          label="Logs"
                          value={`${selectedDetail._count.logs} รายการ`}
                        />
                        <MetaChip
                          icon={<Hash size={10} />}
                          label="Reviews"
                          value={`${selectedDetail._count.careerReviews} รายการ`}
                        />
                      </div>
                    </section>

                    {/* Profile Info */}
                    {selectedDetail.profile ? (
                      <section>
                        <div className="text-xs text-white/30 uppercase tracking-wider mb-2.5">
                          ข้อมูลนักศึกษา
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <MetaChip
                            icon={<Hash size={10} />}
                            label="รหัสนักศึกษา"
                            value={selectedDetail.profile.studentCode}
                          />
                          <MetaChip
                            icon={<Phone size={10} />}
                            label="โทรศัพท์"
                            value={selectedDetail.profile.phoneNumber ?? "—"}
                          />
                          <MetaChip
                            icon={<GraduationCap size={10} />}
                            label="ปีเข้า"
                            value={`${selectedDetail.profile.entryYear}`}
                          />
                          <MetaChip
                            icon={<GraduationCap size={10} />}
                            label="ปีจบ"
                            value={
                              selectedDetail.profile.gradYear
                                ? `${selectedDetail.profile.gradYear}`
                                : "ยังไม่จบ"
                            }
                          />
                          <div className="col-span-2">
                            <MetaChip
                              icon={<Building2 size={10} />}
                              label="ภาควิชา"
                              value={selectedDetail.profile.department}
                            />
                          </div>
                          {selectedDetail.profile.jobField && (
                            <MetaChip
                              icon={<BadgeCheck size={10} />}
                              label="สายงาน"
                              value={selectedDetail.profile.jobField}
                            />
                          )}
                          {selectedDetail.profile.employment_sector && (
                            <MetaChip
                              icon={<Building2 size={10} />}
                              label="ภาคการจ้างงาน"
                              value={
                                SECTOR_LABEL[
                                  selectedDetail.profile.employment_sector
                                ] ?? selectedDetail.profile.employment_sector
                              }
                            />
                          )}
                          <MetaChip
                            icon={<BadgeCheck size={10} />}
                            label="ต่อเนื่องจากสหกิจ"
                            value={
                              selectedDetail.profile.continued_from_coop
                                ? "ใช่"
                                : "ไม่"
                            }
                          />
                        </div>
                      </section>
                    ) : (
                      <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 text-sm text-amber-300">
                        <AlertTriangle size={15} />{" "}
                        ผู้ใช้นี้ยังไม่มีโปรไฟล์นักศึกษา
                      </div>
                    )}

                    {/* Temp Password Result */}
                    {tempPassMap[selectedDetail.id] && (
                      <section>
                        <div className="text-xs text-white/30 uppercase tracking-wider mb-2.5">
                          รหัสผ่านชั่วคราว
                        </div>
                        <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-2 text-xs text-amber-300">
                            <Clock size={13} /> หมดอายุใน 24 ชั่วโมง
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-mono text-sm text-white tracking-widest">
                              {showPassMap[selectedDetail.id]
                                ? tempPassMap[selectedDetail.id]
                                : "●".repeat(12)}
                            </div>
                            <button
                              onClick={() =>
                                setShowPassMap((p) => ({
                                  ...p,
                                  [selectedDetail.id]: !p[selectedDetail.id],
                                }))
                              }
                              className="text-white/30 hover:text-white p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors shrink-0"
                            >
                              {showPassMap[selectedDetail.id] ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleCopy(selectedDetail.id)}
                              className="flex items-center gap-1.5 text-xs bg-emerald-500/20 cursor-pointer hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/25 px-3 py-2 rounded-xl transition-colors shrink-0"
                            >
                              {copiedId === selectedDetail.id ? (
                                <>
                                  <Check size={13} /> คัดลอกแล้ว
                                </>
                              ) : (
                                <>
                                  <Copy size={13} /> คัดลอก
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Actions */}
                    <section>
                      <div className="text-xs text-white/30 uppercase tracking-wider mb-2.5">
                        การดำเนินการ
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* Reset Password */}
                        {resetId === selectedDetail.id ? (
                          <div className="bg-sky-500/10 border border-sky-500/25 rounded-xl p-4 space-y-3">
                            <div className="text-sm text-sky-300 font-medium flex items-center gap-2">
                              <KeyRound size={15} /> ยืนยันการรีเซ็ตรหัสผ่าน?
                            </div>
                            <p className="text-xs text-white/45">
                              ระบบจะสร้างรหัสผ่านชั่วคราวสำหรับ{" "}
                              <span className="text-white/70">
                                {selectedDetail.email}
                              </span>
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setResetId(null)}
                                disabled={resetLoading}
                                className="flex-1 text-xs bg-white/5 cursor-pointer hover:bg-white/10 text-white/50 border border-white/10 py-2 rounded-xl transition-colors disabled:opacity-50"
                              >
                                ยกเลิก
                              </button>
                              <button
                                onClick={() => handleReset(selectedDetail.id)}
                                disabled={resetLoading}
                                className="flex-1 text-xs bg-sky-500/25 hover:bg-sky-500/40 cursor-pointer text-sky-300 border border-sky-500/30 py-2 rounded-xl transition-colors font-semibold disabled:opacity-50"
                              >
                                {resetLoading ? "กำลังสร้าง..." : "ยืนยัน"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setResetId(selectedDetail.id)}
                            className="flex items-center gap-2.5 text-sm cursor-pointer bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/20 px-4 py-3 rounded-xl transition-colors font-medium"
                          >
                            <KeyRound size={16} /> รีเซ็ตรหัสผ่าน (สร้าง Temp
                            Password)
                          </button>
                        )}

                        {/* Delete */}
                        {deleteId === selectedDetail.id ? (
                          <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 space-y-3">
                            <div className="text-sm text-red-300 font-medium flex items-center gap-2">
                              <AlertTriangle size={15} /> ยืนยันการลบบัญชี?
                            </div>
                            <p className="text-xs text-white/45">
                              บัญชีของ{" "}
                              <span className="text-white/70">
                                {selectedDetail.email}
                              </span>{" "}
                              จะถูกลบถาวร ไม่สามารถกู้คืนได้
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setDeleteId(null)}
                                disabled={deleteLoading}
                                className="flex-1 text-xs bg-white/5 cursor-pointer hover:bg-white/10 text-white/50 border border-white/10 py-2 rounded-xl transition-colors disabled:opacity-50"
                              >
                                ยกเลิก
                              </button>
                              <button
                                onClick={() => handleDelete(selectedDetail.id)}
                                disabled={deleteLoading}
                                className="flex-1 text-xs bg-red-500/30 cursor-pointer hover:bg-red-500/50 text-red-300 border border-red-500/30 py-2 rounded-xl transition-colors font-semibold disabled:opacity-50"
                              >
                                {deleteLoading ? "กำลังลบ..." : "ลบบัญชี"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(selectedDetail.id)}
                            className="flex items-center gap-2.5 text-sm cursor-pointer bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 px-4 py-3 rounded-xl transition-colors font-medium"
                          >
                            <Trash2 size={16} /> ลบบัญชีผู้ใช้นี้
                          </button>
                        )}
                      </div>
                    </section>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
