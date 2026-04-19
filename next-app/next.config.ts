import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Static HTML export for Cloudflare Pages (`next-app/out`). All routes are static (○). */
  output: "export",
  /** Silence monorepo warning when the parent repo also has package-lock.json */
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
