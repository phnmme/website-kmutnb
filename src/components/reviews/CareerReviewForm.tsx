/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, FileText, Send } from "lucide-react";
import Particles from "../bits/Particles";
import { createReview } from "@/action/backend/reviewAction";

export default function CareerReviewForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [jobField, setJobField] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      setError("กรุณากรอกหัวข้อและรายละเอียด");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await createReview({
        title,
        description,
        jobField: jobField || undefined,
      });
      if (res) {
        setSuccess("บันทึกรีวิวเรียบร้อยแล้ว");
        setTimeout(() => {
          router.push("/reviews");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={150}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      {/* Card */}
      ```
      {/* Card */}
      <div className="relative z-10 max-w-3xl mx-auto bg-bluez-tone-1/30 rounded-2xl shadow-xl p-8 mt-10">
        <h1 className="text-3xl font-semibold text-bluez-tone-5 mb-2">
          เขียนสิ่งที่อยากจะแนะนำ
        </h1>
        <p className="text-bluez-tone-5/70 text-sm mb-6">
          แนะนำหรือแชร์ประสบการณ์ต่างเพื่อเป็นประโยชน์กับรุ่นน้อง
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-bluez-tone-5">
              หัวข้อแนะนำ & รีวิว <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 text-bluez-tone-1" />
              <input
                type="text"
                placeholder="เช่น ประสบการณ์ทำงานสาย Backend Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Job Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-bluez-tone-5">
              สายงาน (ถ้ามี)
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-3.5 text-bluez-tone-1" />
              <input
                type="text"
                placeholder="เช่น Software Developer, Data Analyst"
                value={jobField}
                onChange={(e) => setJobField(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-bluez-tone-5">
              รายละเอียด <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={8}
              placeholder="เล่าประสบการณ์การทำงาน, ลักษณะงาน, เงินเดือนเริ่มต้น, สิ่งที่ควรรู้ก่อนเข้าทำงาน..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-bluez-tone-3/50 border border-bluez-tone-1 rounded-xl outline-none focus:bg-white resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-congress-300 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-congress-400 transition disabled:opacity-50"
          >
            <Send />
            {isLoading ? "กำลังบันทึก..." : "บันทึกรีวิว"}
          </button>
        </form>
      </div>
    </>
  );
}
