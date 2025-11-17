import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: standalone' - not needed for Railway
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
