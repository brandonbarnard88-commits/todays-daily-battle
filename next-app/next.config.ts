import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Silence monorepo warning when the parent repo also has package-lock.json */
  turbopack: {
    root: process.cwd(),
  },
  /**
   * URL parity (production): extend with rules mirroring root `vercel.json`
   * (`/verse` → `/verse.html`, international shells, query habits, etc.).
   */
  async redirects() {
    return [];
  },
};

export default nextConfig;
