import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components stay off so the fake session cookie and per-request
  // mock delays render on each visit instead of being prerendered.
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
