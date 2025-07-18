import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**', // This makes it more secure by only allowing images from this path
      },
      // ... any other domains you need can go here
    ],
  },
};

export default nextConfig;
