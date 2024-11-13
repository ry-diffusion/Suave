import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'presencial.ifgoiano.edu.br',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'ava.cefetmg.br',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'ava.ifpr.edu.br',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'suap.ifgoiano.edu.br',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'suap.ifpr.edu.br',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
