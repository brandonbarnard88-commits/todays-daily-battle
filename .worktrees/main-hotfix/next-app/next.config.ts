import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Static HTML export for Cloudflare Pages (`next-app/out`). All routes are static (○). */
  output: "export",
  /**
   * Required if you ever use `next/image` with `output: "export"`.
   * Root deploy (e.g. preview.pages.dev): leave `basePath` / `assetPrefix` unset.
   * Subpath deploy only: set both to the same path (e.g. `basePath: "/pilot"`, `assetPrefix: "/pilot"`).
   */
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  /** Silence monorepo warning when the parent repo also has package-lock.json */
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
