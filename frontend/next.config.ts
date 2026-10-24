import type { NextConfig } from "next";

const siteBuild = process.env.NEXT_PUBLIC_SITE ?? (process.env.VERCEL ? "1" : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_SITE: siteBuild },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
