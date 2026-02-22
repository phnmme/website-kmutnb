/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface EmploymentSectorItem {
  year: number;
  private: number;
  government: number;
}

interface SectorComparisonChartProps {
  data: EmploymentSectorItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-bluez-tone-1/90 px-4 py-3 shadow-xl backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bluez-tone-2">
          ปี {label}
        </p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm" style={{ color: entry.fill }}>
            {entry.name === "private" ? "ภาคเอกชน" : "ภาครัฐ"}
            {": "}
            <span className="font-bold">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function SectorComparisonChart({ data }: SectorComparisonChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    year: item.year.toString(),
  }));

  const totalPrivate = data.reduce((sum, d) => sum + d.private, 0);
  const totalGovernment = data.reduce((sum, d) => sum + d.government, 0);
  const total = totalPrivate + totalGovernment;

  const privatePercent = total
    ? ((totalPrivate / total) * 100).toFixed(1)
    : "0";
  const governmentPercent = total
    ? ((totalGovernment / total) * 100).toFixed(1)
    : "0";

  const trend =
    data.length >= 2
      ? (
          ((data[data.length - 1].private - data[0].private) /
            (data[0].private || 1)) *
          100
        ).toFixed(1)
      : "0";

  const trendUp = Number(trend) >= 0;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <p className="text-xs font-semibold uppercase tracking-widest text-bluez-tone-2">
            Employment Sector
          </p>
        </div>
        <h2 className="text-lg font-bold text-white">
          การทำงานภาคเอกชนและภาครัฐ
        </h2>
        <p className="mt-0.5 text-sm text-bluez-tone-2/70">
          เปรียบเทียบจำนวนบัณฑิตที่ทำงานในแต่ละภาคส่วน
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            barGap={6}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.07)"
            />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#b3cfe5", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fill: "#b3cfe5", fontSize: 12 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Legend
              formatter={(value) =>
                value === "private" ? (
                  <span className="text-xs text-bluez-tone-2">ภาคเอกชน</span>
                ) : (
                  <span className="text-xs text-bluez-tone-2">ภาครัฐ</span>
                )
              }
            />
            <Bar
              dataKey="private"
              fill="#008cfa"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
            <Bar
              dataKey="government"
              fill="#f59e0b"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-bluez-tone-2/70">สัดส่วนเอกชน</p>
          <p className="mt-1 text-2xl font-bold text-congress-400">
            {privatePercent}%
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-bluez-tone-2/70">สัดส่วนภาครัฐ</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">
            {governmentPercent}%
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-bluez-tone-2/70">แนวโน้มเอกชน</p>
          <p
            className={`mt-1 text-xl font-bold ${
              trendUp ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {trendUp ? `+${trend}%` : `${trend}%`}
          </p>
          <p
            className={`text-xs ${
              trendUp ? "text-emerald-400/70" : "text-rose-400/70"
            }`}
          >
            {trendUp ? "เพิ่มขึ้น" : "ลดลง"}
          </p>
        </div>
      </div>
    </div>
  );
}
