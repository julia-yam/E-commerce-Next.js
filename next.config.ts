import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "front-school-strapi.ktsdev.ru",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "front-school.minio.ktsdev.ru",
        pathname: "/**",
      },
    ],
  },

  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/shared/styles")],
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
