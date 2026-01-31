import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img5.pic.in.th",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
