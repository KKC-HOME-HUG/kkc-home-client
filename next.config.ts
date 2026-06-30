import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // base64 image uploads go through Server Actions; default body limit is 1MB.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
