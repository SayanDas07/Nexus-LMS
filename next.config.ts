import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during production build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during production build
  },
};

export default nextConfig;
