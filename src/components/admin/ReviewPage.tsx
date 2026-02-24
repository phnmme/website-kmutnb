"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  FileText,
  Filter,
  RefreshCw,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  getReviews,
  getReviewJobFields,
  updateReviewStatus,
} from "@/action/backend/reviewAction";
import type {
  CareerReview,
  ReviewStatus,
  GetReviewsParams,
} from "@/action/backend/reviewAction";
import Particles from "../bits/Particles";

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ReviewStatus,
  { label: string; icon: any; badge: string }
> = {
  pending: {
    label: "รออนุมัติ",
    icon: Clock,
    badge: "bg-amber-400/15 text-amber-300 border-amber-400/25",
  },
  approved: {
    label: "อนุมัติแล้ว",
    icon: CheckCircle2,
    badge: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25",
  },
  rejected: {
    label: "ปฏิเสธ",
    icon: XCircle,
    badge: "bg-red-400/15 text-red-300 border-red-400/25",
  },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชั่วโมงที่แล้ว`;
  return `${Math.floor(h / 24)} วันที่แล้ว`;
}

// API ส่ง profile มาแทน name field
function getDisplayName(user: CareerReview["user"]) {
  if (user.profile)
    return `${user.profile.firstNameTh} ${user.profile.lastNameTh}`;
  return user.email;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ReviewMainPage() {
  // ── Data ─────────────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<CareerReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // ── Filter ───────────────────────────────────────────────────────────────────
  const [filter, setFilter] = useState<ReviewStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [jobFieldFilter, setJobFieldFilter] = useState("all");
  const [jobFields, setJobFields] = useState<string[]>(["all"]);

  // ── UI ───────────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // ── Toast ─────────────────────────────────────────────────────────────────────
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

  // reset page on filter/jobField change
  useEffect(() => {
    setPage(1);
  }, [filter, jobFieldFilter]);

  // ── Fetch jobFields (once) ────────────────────────────────────────────────────
  useEffect(() => {
    getReviewJobFields()
      .then((fields) => setJobFields(["all", ...fields]))
      .catch(() => {});
  }, []);

  // ── Fetch reviews ─────────────────────────────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetReviewsParams = {
        search: debouncedSearch || undefined,
        status: filter !== "all" ? filter : undefined,
        jobField: jobFieldFilter !== "all" ? jobFieldFilter : undefined,
        page,
        limit: LIMIT,
      };
      const res = await getReviews(params);
      setReviews(res.data);
      setTotalReviews(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      showToast(err.message || "ดึงข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filter, jobFieldFilter, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      all: totalReviews,
      pending: reviews.filter((r) => r.status === "pending").length,
      approved: reviews.filter((r) => r.status === "approved").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    }),
    [reviews, totalReviews]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleAction = async (id: number, status: ReviewStatus) => {
    setActionLoadingId(id);
    try {
      await updateReviewStatus(id, status);
      // optimistic update
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      setDetailId(null);
      showToast(
        status === "approved" ? "อนุมัติ Review สำเร็จ" : "ปฏิเสธ Review สำเร็จ"
      );
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const detailReview = detailId
    ? reviews.find((r) => r.id === detailId) ?? null
    : null;
  const hasFilter = search || jobFieldFilter !== "all";

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
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-violet-500/8 blur-3xl" />
      </div>

      {/* Toast */}
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

      <div className="relative z-10 min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-5">
          {/* ── Header ───────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-bluez-tone-3/50 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 shrink-0">
                <FileText size={20} className="text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Career Reviews
                </h1>
                <p className="text-xs text-white/40 mt-0.5">
                  จัดการรีวิวสายอาชีพที่ส่งเข้ามา
                </p>
              </div>
            </div>
            <button
              onClick={fetchReviews}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-white/5 cursor-pointer hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all w-full sm:w-auto disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              รีเฟรช
            </button>
          </div>

          {/* ── Stats tabs ───────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "all", label: "ทั้งหมด", color: "text-white" },
              { key: "pending", label: "รออนุมัติ", color: "text-amber-400" },
              {
                key: "approved",
                label: "อนุมัติแล้ว",
                color: "text-emerald-400",
              },
              { key: "rejected", label: "ปฏิเสธ", color: "text-red-400" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setFilter(s.key as any)}
                className={`bg-bluez-tone-3/50 cursor-pointer border rounded-xl px-4 py-4 text-center transition-all hover:bg-white/10 ${
                  filter === s.key
                    ? "border-white/30 bg-white/10"
                    : "border-white/10"
                }`}
              >
                <div className={`text-2xl font-bold ${s.color}`}>
                  {loading ? "—" : stats[s.key as keyof typeof stats]}
                </div>
                <div className="text-xs text-bluez-tone-5 mt-1">{s.label}</div>
              </button>
            ))}
          </div>

          {/* ── Filters ──────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bluez-tone-5 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อรีวิว, คำอธิบาย, ผู้ส่ง..."
                className="w-full bg-bluez-tone-3/50 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-400/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="relative">
              <Briefcase
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-bluez-tone-5 pointer-events-none"
              />
              <select
                value={jobFieldFilter}
                onChange={(e) => setJobFieldFilter(e.target.value)}
                className="appearance-none bg-bluez-tone-3/50 border border-white/10 rounded-xl pl-8 pr-8 py-2.5 text-sm text-white/70 outline-none focus:border-emerald-400/50 transition-all cursor-pointer min-w-[180px]"
              >
                {jobFields.map((f) => (
                  <option
                    key={f}
                    value={f}
                    className="bg-bluez-tone-2 text-black"
                  >
                    {f === "all" ? "ทุกสายงาน" : f}
                  </option>
                ))}
              </select>
            </div>
            {hasFilter && (
              <button
                onClick={() => {
                  setSearch("");
                  setJobFieldFilter("all");
                }}
                className="flex items-center gap-1.5 text-sm text-bluez-tone-5 hover:text-white border border-white/10 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all shrink-0"
              >
                <X size={14} /> ล้าง
              </button>
            )}
          </div>

          {/* ── Result count ─────────────────────────── */}
          <div className="text-xs text-white/30 px-1">
            {loading
              ? "กำลังโหลด..."
              : `แสดง ${reviews.length} จาก ${totalReviews} รายการ`}
          </div>

          {/* ── Review Cards ─────────────────────────── */}
          {loading && reviews.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3.5 bg-white/10 rounded animate-pulse w-1/3" />
                      <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
                      <div className="h-2.5 bg-white/5 rounded animate-pulse w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl py-16 text-center text-white/25 text-sm">
              ไม่พบรีวิวที่ตรงกับเงื่อนไข
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => {
                const cfg = STATUS_CONFIG[review.status];
                const StatusIcon = cfg.icon;
                const isExpanded = expandedId === review.id;
                const displayName = getDisplayName(review.user);
                const isActioning = actionLoadingId === review.id;

                return (
                  <div
                    key={review.id}
                    className="group bg-bluez-tone-3/50 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-200"
                  >
                    {/* Card Header */}
                    <div
                      className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : review.id)
                      }
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5">
                        {displayName.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-2 mb-1">
                          <h3 className="font-semibold text-white text-sm leading-snug">
                            {review.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg border ${cfg.badge} shrink-0`}
                          >
                            <StatusIcon size={10} />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-sm text-white/45 line-clamp-1 mb-2">
                          {review.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-bluez-tone-5">
                          <span className="flex items-center gap-1">
                            <User size={11} /> {displayName}
                          </span>
                          {review.jobField && (
                            <span className="flex items-center gap-1">
                              <Briefcase size={11} /> {review.jobField}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar size={11} /> {timeAgo(review.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {review.status === "pending" && (
                          <div
                            className="hidden sm:flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() =>
                                handleAction(review.id, "approved")
                              }
                              disabled={isActioning}
                              className="flex items-center gap-1 text-xs cursor-pointer bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/25 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isActioning ? (
                                <RefreshCw size={11} className="animate-spin" />
                              ) : (
                                <Check size={12} />
                              )}{" "}
                              อนุมัติ
                            </button>
                            <button
                              onClick={() =>
                                handleAction(review.id, "rejected")
                              }
                              disabled={isActioning}
                              className="flex items-center gap-1 text-xs bg-red-500/20 cursor-pointer hover:bg-red-500/35 text-red-300 border border-red-500/25 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isActioning ? (
                                <RefreshCw size={11} className="animate-spin" />
                              ) : (
                                <X size={12} />
                              )}{" "}
                              ปฏิเสธ
                            </button>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailId(review.id);
                          }}
                          className="text-bluez-tone-5 hover:text-white/70 cursor-pointer p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        {isExpanded ? (
                          <ChevronUp size={15} className="text-white/30" />
                        ) : (
                          <ChevronDown size={15} className="text-white/30" />
                        )}
                      </div>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 border-t border-white/10">
                        <div className="mt-4 space-y-4">
                          <div>
                            <div className="text-xs text-bluez-tone-5 uppercase tracking-wider mb-1.5">
                              คำอธิบาย
                            </div>
                            <p className="text-sm text-white/65 leading-relaxed">
                              {review.description}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                              {
                                label: "ผู้ส่ง",
                                value: displayName,
                                icon: <User size={12} />,
                              },
                              {
                                label: "อีเมล",
                                value: review.user.email,
                                icon: <FileText size={12} />,
                              },
                              {
                                label: "สายงาน",
                                value: review.jobField ?? "ไม่ระบุ",
                                icon: <Briefcase size={12} />,
                              },
                              {
                                label: "วันที่ส่ง",
                                value: new Date(
                                  review.createdAt
                                ).toLocaleDateString("th-TH"),
                                icon: <Calendar size={12} />,
                              },
                              {
                                label: "อัปเดตล่าสุด",
                                value: new Date(
                                  review.updatedAt
                                ).toLocaleDateString("th-TH"),
                                icon: <Calendar size={12} />,
                              },
                              {
                                label: "Review ID",
                                value: `#${review.id}`,
                                icon: <Filter size={12} />,
                              },
                            ].map((m) => (
                              <div
                                key={m.label}
                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5"
                              >
                                <div className="flex items-center gap-1 text-bluez-tone-5 text-xs mb-1">
                                  {m.icon} {m.label}
                                </div>
                                <div className="text-xs text-white/65 font-medium truncate">
                                  {m.value}
                                </div>
                              </div>
                            ))}
                          </div>
                          {review.status === "pending" && (
                            <div className="flex gap-2 sm:hidden">
                              <button
                                onClick={() =>
                                  handleAction(review.id, "approved")
                                }
                                disabled={isActioning}
                                className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/25 py-2.5 rounded-xl transition-colors font-medium disabled:opacity-50"
                              >
                                {isActioning ? (
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Check size={14} />
                                )}{" "}
                                อนุมัติ
                              </button>
                              <button
                                onClick={() =>
                                  handleAction(review.id, "rejected")
                                }
                                disabled={isActioning}
                                className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-red-500/20 hover:bg-red-500/35 text-red-300 border border-red-500/25 py-2.5 rounded-xl transition-colors font-medium disabled:opacity-50"
                              >
                                {isActioning ? (
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <X size={14} />
                                )}{" "}
                                ปฏิเสธ
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Pagination ───────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5">
              <span className="text-xs text-white/30">
                หน้า {page} / {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-25 transition-all"
                >
                  ก่อนหน้า
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-25 transition-all"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ──────────────────────────────── */}
      {detailReview && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDetailId(null)}
        >
          <div
            className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                  {getDisplayName(detailReview.user).charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">
                    {detailReview.title}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">
                    {getDisplayName(detailReview.user)} ·{" "}
                    {detailReview.user.email}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDetailId(null)}
                className="text-white/30 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-2"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${
                    STATUS_CONFIG[detailReview.status].badge
                  }`}
                >
                  {(() => {
                    const I = STATUS_CONFIG[detailReview.status].icon;
                    return <I size={11} />;
                  })()}
                  {STATUS_CONFIG[detailReview.status].label}
                </span>
                {detailReview.jobField && (
                  <span className="inline-flex items-center gap-1 text-xs bg-violet-400/15 text-violet-300 border border-violet-400/25 px-2.5 py-1 rounded-lg">
                    <Briefcase size={11} /> {detailReview.jobField}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs bg-white/5 text-white/40 border border-white/10 px-2.5 py-1 rounded-lg">
                  <Calendar size={11} /> {timeAgo(detailReview.createdAt)}
                </span>
              </div>
              <div>
                <div className="text-xs text-white/30 uppercase tracking-wider mb-2">
                  คำอธิบาย
                </div>
                <p className="text-sm text-white/70 leading-relaxed bg-white/5 border border-white/10 rounded-xl p-4">
                  {detailReview.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Review ID", value: `#${detailReview.id}` },
                  { label: "User ID", value: `#${detailReview.userId}` },
                  {
                    label: "สร้างเมื่อ",
                    value: new Date(detailReview.createdAt).toLocaleDateString(
                      "th-TH"
                    ),
                  },
                  {
                    label: "อัปเดตล่าสุด",
                    value: new Date(detailReview.updatedAt).toLocaleDateString(
                      "th-TH"
                    ),
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5"
                  >
                    <div className="text-xs text-white/25 mb-0.5">
                      {m.label}
                    </div>
                    <div className="text-xs text-white/65 font-medium">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            {detailReview.status === "pending" ? (
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={() => handleAction(detailReview.id, "rejected")}
                  disabled={actionLoadingId === detailReview.id}
                  className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-500/20 hover:bg-red-500/35 text-red-300 border border-red-500/25 py-3 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  {actionLoadingId === detailReview.id ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <X size={15} />
                  )}{" "}
                  ปฏิเสธ
                </button>
                <button
                  onClick={() => handleAction(detailReview.id, "approved")}
                  disabled={actionLoadingId === detailReview.id}
                  className="flex-1 flex items-center justify-center gap-2 text-sm bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 py-3 rounded-xl transition-colors font-semibold disabled:opacity-50"
                >
                  {actionLoadingId === detailReview.id ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <Check size={15} />
                  )}{" "}
                  อนุมัติรีวิวนี้
                </button>
              </div>
            ) : (
              <div className="px-6 pb-6">
                <div
                  className={`flex items-center justify-center gap-2 text-sm py-3 rounded-xl border ${
                    STATUS_CONFIG[detailReview.status].badge
                  }`}
                >
                  {(() => {
                    const I = STATUS_CONFIG[detailReview.status].icon;
                    return <I size={15} />;
                  })()}
                  รีวิวนี้{STATUS_CONFIG[detailReview.status].label}แล้ว
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
