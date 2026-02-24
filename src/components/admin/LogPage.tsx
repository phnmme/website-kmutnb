"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
  Clock,
  User,
  Tag,
  FileText,
  RefreshCw,
  Check,
  AlertTriangle,
} from "lucide-react";
import { getLogs, getLogActions } from "@/action/backend/logsAction";
import type { Log, GetLogsParams } from "@/action/backend/logsAction";
import Particles from "../bits/Particles";

// ─── Types / Helpers ─────────────────────────────────────────────────────────

type LogLevel = "info" | "success" | "warning" | "danger";

// API ไม่มี user.name ส่งมาแค่ user.email — ใช้ส่วนหน้า @ เป็น display
function getDisplayName(user: Log["user"]) {
  if (!user) return null;
  return user.email.split("@")[0];
}

// Map action string → level สำหรับ badge (ปรับตาม action จริงในระบบได้)
function inferLevel(action: string): LogLevel {
  const a = action.toUpperCase();
  if (
    a.includes("DELETE") ||
    a.includes("FAIL") ||
    a.includes("ERROR") ||
    a.includes("REJECT")
  )
    return "danger";
  if (
    a.includes("UPDATE") ||
    a.includes("CHANGE") ||
    a.includes("RESET") ||
    a.includes("REMOVE")
  )
    return "warning";
  if (
    a.includes("LOGIN") ||
    a.includes("CREATE") ||
    a.includes("APPROVE") ||
    a.includes("REGISTER")
  )
    return "success";
  return "info";
}

const LEVEL_CONFIG: Record<
  LogLevel,
  { label: string; dot: string; badge: string; row: string }
> = {
  info: {
    label: "Info",
    dot: "bg-sky-400",
    badge: "bg-sky-400/15 text-sky-300 border-sky-400/25",
    row: "",
  },
  success: {
    label: "Success",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25",
    row: "",
  },
  warning: {
    label: "Warning",
    dot: "bg-amber-400",
    badge: "bg-amber-400/15 text-amber-300 border-amber-400/25",
    row: "bg-amber-400/[0.03]",
  },
  danger: {
    label: "Danger",
    dot: "bg-red-400",
    badge: "bg-red-400/15 text-red-300 border-red-400/25",
    row: "bg-red-400/[0.04]",
  },
};

const PAGE_SIZE = 8;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ActivityLogPage() {
  // ── Data ─────────────────────────────────────────────────────────────────────
  const [logs, setLogs] = useState<Log[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);

  // ── Filter ───────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel | "all">("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [allActions, setAllActions] = useState<string[]>(["all"]);
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  // ── Pagination (client-side) ──────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  // ── Loading / Toast ───────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Debounce search 400ms ─────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [levelFilter, actionFilter, sortDir]);

  // ── Fetch action list (once) ──────────────────────────────────────────────────
  useEffect(() => {
    getLogActions()
      .then((actions) => setAllActions(["all", ...actions]))
      .catch(() => {});
  }, []);

  // ── Fetch logs (server: search + action filter) ───────────────────────────────
  // Strategy: fetch 100 records จาก server แล้ว paginate + level-filter ฝั่ง client
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetLogsParams = {
        search: debouncedSearch || undefined,
        action: actionFilter !== "all" ? actionFilter : undefined,
        page: 1,
        limit: 100,
      };
      const res = await getLogs(params);
      setLogs(res.data);
      setTotalLogs(res.pagination.total);
    } catch (err: any) {
      showToast(err.message || "ดึง Log ไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── Client-side: level filter + sort ─────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = logs.map((l) => ({
      ...l,
      level: inferLevel(l.action) as LogLevel,
    }));
    if (levelFilter !== "all")
      result = result.filter((l) => l.level === levelFilter);
    result.sort((a, b) => {
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "desc" ? -diff : diff;
    });
    return result;
  }, [logs, levelFilter, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: totalLogs,
      danger: filtered.filter((l) => l.level === "danger").length,
      warning: filtered.filter((l) => l.level === "warning").length,
      success: filtered.filter((l) => l.level === "success").length,
    }),
    [filtered, totalLogs]
  );

  const hasActiveFilter =
    search || levelFilter !== "all" || actionFilter !== "all";
  const clearFilters = () => {
    setSearch("");
    setLevelFilter("all");
    setActionFilter("all");
  };

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
      <div className="relative z-10 min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border backdrop-blur-xl ${
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

        <div className="mx-auto max-w-7xl space-y-5">
          {/* ── Header ─────────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-bluez-tone-3/50  border border-white/10 rounded-2xl px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 shrink-0">
                <Activity size={20} className="text-violet-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Activity Log
                </h1>
                <p className="text-xs text-white/40 mt-0.5">
                  บันทึกกิจกรรมทั้งหมดในระบบ
                </p>
              </div>
            </div>
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center cursor-pointer justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all w-full sm:w-auto disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              รีเฟรช
            </button>
          </div>

          {/* ── Stats ──────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "ทั้งหมด", value: stats.total, color: "text-white" },
              { label: "Danger", value: stats.danger, color: "text-red-400" },
              {
                label: "Warning",
                value: stats.warning,
                color: "text-amber-400",
              },
              {
                label: "Success",
                value: stats.success,
                color: "text-emerald-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-bluez-tone-3/50 border border-white/10 rounded-xl px-4 py-4 text-center"
              >
                <div className={`text-2xl font-bold ${s.color}`}>
                  {loading ? "—" : s.value}
                </div>
                <div className="text-xs text-bluez-tone-5 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Filters ────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute z-50 left-3.5 top-1/2 -translate-y-1/2 text-bluez-tone-5 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหา action, details, ผู้ใช้..."
                className="w-full bg-bluez-tone-3/50  border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-violet-400/50 focus:bg-white/10 transition-all"
              />
            </div>

            {/* Level filter — client-side */}
            <div className="relative">
              <Filter
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-bluez-tone-5 pointer-events-none"
              />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as any)}
                className="appearance-none bg-bluez-tone-3/50 border border-white/10 rounded-xl pl-8 pr-8 py-2.5 text-sm text-white/70 outline-none focus:border-violet-400/50 transition-all cursor-pointer min-w-[130px]"
              >
                <option value="all" className="bg-slate-900">
                  ทุก Level
                </option>
                {(["info", "success", "warning", "danger"] as LogLevel[]).map(
                  (l) => (
                    <option
                      key={l}
                      value={l}
                      className="bg-slate-900 capitalize"
                    >
                      {LEVEL_CONFIG[l].label}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Action filter — server-side */}
            <div className="relative">
              <Tag
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-bluez-tone-5 pointer-events-none"
              />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="appearance-none bg-bluez-tone-3/50 border border-white/10 rounded-xl pl-8 pr-8 py-2.5 text-sm text-white/70 outline-none focus:border-violet-400/50 transition-all cursor-pointer min-w-[160px]"
              >
                {allActions.map((a) => (
                  <option key={a} value={a} className="bg-slate-900">
                    {a === "all" ? "ทุก Action" : a}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white border border-white/10 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all shrink-0"
              >
                <X size={14} /> ล้าง
              </button>
            )}
          </div>

          {/* ── Table ──────────────────────────────────── */}
          <div className="bg-bluez-tone-3/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs text-bluez-tone-5">
                {loading
                  ? "กำลังโหลด..."
                  : `แสดง ${paginated.length} จาก ${filtered.length} รายการ (ทั้งหมด ${totalLogs})`}
              </span>
              <button
                onClick={() =>
                  setSortDir((d) => (d === "desc" ? "asc" : "desc"))
                }
                className="flex items-center cursor-pointer gap-1.5 text-xs text-bluez-tone-5 hover:text-white/70 transition-colors"
              >
                <ArrowUpDown size={13} />
                {sortDir === "desc" ? "ล่าสุดก่อน" : "เก่าสุดก่อน"}
              </button>
            </div>

            {/* ── Desktop Table ─────────────────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 ">
                    {["#", "Level", "Action", "Details", "ผู้ใช้", "เวลา"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-xs font-semibold text-bluez-tone-5 uppercase tracking-widest whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Skeleton */}
                  {loading && logs.length === 0 ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-5 py-3.5">
                          <div className="h-3 w-8 bg-white/10 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="h-5 w-16 bg-white/10 rounded-lg animate-pulse" />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="h-5 w-28 bg-white/10 rounded-lg animate-pulse" />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-14 text-center text-white/25 text-sm"
                      >
                        ไม่พบข้อมูล
                      </td>
                    </tr>
                  ) : (
                    paginated.map((log) => {
                      const cfg = LEVEL_CONFIG[log.level];
                      const isOpen = expanded === log.id;
                      const displayName = getDisplayName(log.user);
                      return (
                        <>
                          <tr
                            key={log.id}
                            onClick={() => setExpanded(isOpen ? null : log.id)}
                            className={`cursor-pointer hover:bg-white/[0.06] transition-colors group ${cfg.row}`}
                          >
                            <td className="px-5 py-3.5">
                              <span className="text-xs font-mono text-white/25">
                                #{log.id}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${cfg.badge}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                                />
                                {cfg.label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <code className="text-xs font-mono bg-white/5 text-violet-300 px-2 py-1 rounded-lg border border-white/10">
                                {log.action}
                              </code>
                            </td>
                            <td className="px-5 py-3.5 max-w-xs">
                              <span className="text-sm text-white/60 truncate block">
                                {log.details ?? "—"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              {displayName ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500/40 to-blue-600/40 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                    {displayName.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm text-white/70 whitespace-nowrap">
                                    {displayName}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-white/25 italic">
                                  System
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex flex-col">
                                <span className="text-xs text-white/50 whitespace-nowrap">
                                  {timeAgo(log.createdAt)}
                                </span>
                                <span className="text-[10px] text-white/25">
                                  {new Date(log.createdAt).toLocaleString(
                                    "th-TH"
                                  )}
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded row */}
                          {isOpen && (
                            <tr
                              key={`${log.id}-exp`}
                              className="bg-white/[0.02]"
                            >
                              <td colSpan={6} className="px-5 pb-4 pt-1">
                                <div className="flex flex-wrap gap-4 text-sm text-white/50 border border-white/10 rounded-xl p-4 bg-white/5">
                                  <div className="flex items-start gap-2">
                                    <FileText
                                      size={14}
                                      className="text-bluez-tone-5 mt-0.5 shrink-0"
                                    />
                                    <div>
                                      <div className="text-xs text-bluez-tone-5 mb-0.5">
                                        Details เต็ม
                                      </div>
                                      <div className="text-white/70">
                                        {log.details ?? "ไม่มีรายละเอียด"}
                                      </div>
                                    </div>
                                  </div>
                                  {log.user && (
                                    <div className="flex items-start gap-2">
                                      <User
                                        size={14}
                                        className="text-bluez-tone-5 mt-0.5 shrink-0"
                                      />
                                      <div>
                                        <div className="text-xs text-bluez-tone-5 mb-0.5">
                                          ผู้ใช้
                                        </div>
                                        <div className="text-white/70">
                                          {displayName} · {log.user.email}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex items-start gap-2">
                                    <Clock
                                      size={14}
                                      className="text-bluez-tone-5 mt-0.5 shrink-0"
                                    />
                                    <div>
                                      <div className="text-xs text-bluez-tone-5 mb-0.5">
                                        เวลาแน่นอน
                                      </div>
                                      <div className="text-white/70">
                                        {new Date(log.createdAt).toLocaleString(
                                          "th-TH",
                                          {
                                            dateStyle: "full",
                                            timeStyle: "medium",
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ──────────────────────────── */}
            <div className="md:hidden divide-y divide-white/5">
              {loading && logs.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-4 py-4 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-5 w-28 bg-white/10 rounded-lg animate-pulse" />
                      <div className="h-5 w-16 bg-white/10 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse" />
                    <div className="h-2.5 w-1/2 bg-white/5 rounded animate-pulse" />
                  </div>
                ))
              ) : paginated.length === 0 ? (
                <div className="py-14 text-center text-white/25 text-sm">
                  ไม่พบข้อมูล
                </div>
              ) : (
                paginated.map((log) => {
                  const cfg = LEVEL_CONFIG[log.level];
                  const displayName = getDisplayName(log.user);
                  return (
                    <div
                      key={log.id}
                      onClick={() =>
                        setExpanded(expanded === log.id ? null : log.id)
                      }
                      className={`px-4 py-4 cursor-pointer hover:bg-white/[0.04] transition-colors ${cfg.row}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <code className="text-xs font-mono bg-white/5 text-violet-300 px-2 py-1 rounded-lg border border-white/10">
                          {log.action}
                        </code>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg border ${cfg.badge} shrink-0`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                          />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-white/55 mb-2">
                        {log.details ?? "—"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/30">
                        <span>{displayName ?? "System"}</span>
                        <span>{timeAgo(log.createdAt)}</span>
                      </div>
                      {expanded === log.id && (
                        <div className="mt-3 border border-white/10 rounded-xl p-3 bg-white/5 text-xs text-white/50 space-y-1.5">
                          <div>
                            <span className="text-white/25">Details: </span>
                            {log.details ?? "—"}
                          </div>
                          {log.user && (
                            <div>
                              <span className="text-white/25">Email: </span>
                              {log.user.email}
                            </div>
                          )}
                          <div>
                            <span className="text-white/25">เวลา: </span>
                            {new Date(log.createdAt).toLocaleString("th-TH")}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* ── Pagination ─────────────────────────────── */}
            <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-bluez-tone-5">
                หน้า {page} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-lg border border-white/10 text-bluez-tone-5 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={15} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1
                  )
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1)
                      acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="text-bluez-tone-5 text-xs px-1"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-8 h-8 flex items-center cursor-pointer justify-center rounded-lg text-xs font-medium transition-all ${
                          page === p
                            ? "bg-violet-500/30 border border-violet-400/40 text-violet-300"
                            : "border border-white/10 text-bluez-tone-5 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center cursor-pointer  justify-center rounded-lg border border-white/10 text-bluez-tone-5 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
