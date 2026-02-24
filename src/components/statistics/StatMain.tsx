import { DashboardStatistics } from "@/types/staticType";
import { CoopEmploymentChart } from "./CoopChart";
import { BarChart3 } from "lucide-react";
import Particles from "../bits/Particles";
import { SectorComparisonChart } from "./EmployeeChart";

interface StatMainProps {
  statistics: DashboardStatistics;
}

export default function StatMain({ statistics }: StatMainProps) {
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
      <div className="relative z-10 bg-bluez-tone-1/80 rounded-2xl ">
        <header className="rounded-lg ">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-congress-400/20">
              <BarChart3 className="h-5 w-5 text-bluez-tone-2" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl text-balance">
                สถิตินักศึกษาสหกิจศึกษา
              </h1>
              <p className="text-sm text-bluez-tone-2/70">
                ข้อมูลการจ้างงานบัณฑิตจากโครงการสหกิจศึกษา ย้อนหลัง 5 ปี
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            {/* Charts Grid */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <CoopEmploymentChart data={statistics?.coopChart} />
              <SectorComparisonChart data={statistics?.employmentSectorChart} />
            </section>

            {/* Trend + Table */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-2"></section>
          </div>
        </main>
      </div>
    </>
  );
}
