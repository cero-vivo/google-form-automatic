import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during builds to avoid blocking deploys while iterating
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
