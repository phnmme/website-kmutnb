"use client";

import Particles from "../bits/Particles";
import RotatingText from "../bits/RotatingText";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
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

      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold text-congress-50 flex flex-wrap justify-center gap-2">
          ยินดีต้อนรับสู่
          <motion.div
            layout
            transition={{
              layout: {
                duration: 1,
                ease: "easeInOut",
              },
            }}
            className="inline-flex"
          >
            <RotatingText
              texts={[
                "IPTM!",
                "Information",
                "Production",
                "Technology",
                "Management",
              ]}
              mainClassName="
          inline-flex items-center justify-center
          px-3
          bg-bluez-tone-1 text-congress-50
          py-1
          rounded-lg shadow-lg
        "
              staggerFrom="random"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </motion.div>
        </h1>

        <p className="mt-4 text-lg text-white">
          ระบบสารสนเทศเพื่อการจัดการข้อมูลนักศึกษาที่จบการศึกษา
        </p>
        <Link href="/students">
          <p className="mt-6 inline-block px-6 py-3 bg-gray-200/20 shadow-xs font-semibold rounded-md text-congress-50 hover:bg-[#80eeff]/40 transition">
            ค้นหาข้อมูลนักศึกษาที่สำเร็จการศึกษา
          </p>
        </Link>
      </div>
    </>
  );
}
