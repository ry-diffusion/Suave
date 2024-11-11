import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'presencial.ifgoiano.edu.br',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
