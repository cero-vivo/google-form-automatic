import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during builds to avoid blocking deploys while iterating
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'gravatar.com' },
    ],
  },
};

export default nextConfig;
