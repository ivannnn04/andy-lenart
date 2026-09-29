import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve every image file as-is: no resizing or re-compression.
    unoptimized: true,
  },
};

export default nextConfig;
