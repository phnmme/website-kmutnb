/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface CoopChartItem {
  year: number;
  graduates: number;
  coopEmployed: number;
}

interface CoopEmploymentChartProps {
  data: CoopChartItem[];
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
            {entry.name === "graduates" ? "บัณฑิตทั้งหมด" : "ทำงานต่อจากสหกิจ"}
            {": "}
            <span className="font-bold">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CoopEmploymentChart({ data }: CoopEmploymentChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    year: item.year.toString(),
  }));

  const percentagePerYear = data.map((item) => ({
    year: item.year,
    percent:
      item.graduates > 0 ? (item.coopEmployed / item.graduates) * 100 : 0,
  }));

  const avg =
    percentagePerYear.length > 0
      ? (
          percentagePerYear.reduce((sum, y) => sum + y.percent, 0) /
          percentagePerYear.length
        ).toFixed(1)
      : "0";

  const maxYear =
    percentagePerYear.length > 0
      ? percentagePerYear.reduce((prev, current) =>
          current.percent > prev.percent ? current : prev
        )
      : null;

  const trend =
    percentagePerYear.length >= 2
      ? (
          percentagePerYear[percentagePerYear.length - 1].percent -
          percentagePerYear[0].percent
        ).toFixed(1)
      : "0";

  const trendUp = Number(trend) >= 0;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/10  p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-congress-400" />
          <p className="text-xs font-semibold uppercase tracking-widest text-bluez-tone-2">
            Coop Employment
          </p>
        </div>
        <h2 className="text-lg font-bold text-white">
          บัณฑิตที่ทำงานต่อจากสหกิจศึกษา
        </h2>
        <p className="mt-0.5 text-sm text-bluez-tone-2/70">
          เปรียบเทียบจำนวนบัณฑิตทั้งหมดกับผู้ที่ได้งานต่อจากสหกิจ
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
                value === "graduates" ? (
                  <span className="text-xs text-bluez-tone-2">
                    บัณฑิตทั้งหมด
                  </span>
                ) : (
                  <span className="text-xs text-bluez-tone-2">
                    ทำงานต่อจากสหกิจ
                  </span>
                )
              }
            />
            <Bar
              dataKey="graduates"
              fill="#4a7fa7"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
            <Bar
              dataKey="coopEmployed"
              fill="#008cfa"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-bluez-tone-2/70">
            อัตราเฉลี่ย {data.length} ปี
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{avg}%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-bluez-tone-2/70">ปีที่สูงสุด</p>
          <p className="mt-1 text-2xl font-bold text-congress-400">
            {maxYear ? `${maxYear.year}` : "-"}
          </p>
          {maxYear && (
            <p className="text-xs text-congress-400/80">
              {maxYear.percent.toFixed(1)}%
            </p>
          )}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-bluez-tone-2/70">แนวโน้ม</p>
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
