"use client";

import { useEffect, useState } from "react";
import { getStatistics } from "@/action/statisticsAction";
import { StatMain } from "@/components/statistics";
import { DashboardStatistics } from "@/types/staticType";

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await getStatistics();

        if (!res || !res.data) {
          setError("ไม่สามารถโหลดข้อมูลสถิติได้");
          return;
        }

        setStatistics(res.data);
      } catch (err: any) {
        console.error("Error fetching statistics:", err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">กำลังโหลดข้อมูลสถิติ...</h1>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">เกิดข้อผิดพลาด</h1>
        <p className="text-red-500">{error || "ไม่พบข้อมูล"}</p>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden pt-26 min-h-screen bg-bluez-tone-4 px-10">
      <StatMain statistics={statistics} />
    </div>
  );
}
