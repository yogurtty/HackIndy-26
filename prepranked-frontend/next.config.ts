import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: [
          '**/backend/**',
          '**/node_modules/**',
          '**/.git/**',
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
