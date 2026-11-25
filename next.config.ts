import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Listening Rooms' full tracks live outside /public (see src/lib/tracks.ts);
  // the two routes that send them need the files deployed with them.
  outputFileTracingIncludes: {
    "/room/*/track": ["./private/audio/**"],
    "/audio/*": ["./private/audio/**"],
  },
  images: {
    // Serve every image file as-is: no resizing or re-compression.
    unoptimized: true,
  },
};

export default nextConfig;
