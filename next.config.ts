import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Tree-shake barrel imports like `import { Box } from "@mui/material"`.
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material", "@mui/x-charts"],
  },
};

export default nextConfig;
