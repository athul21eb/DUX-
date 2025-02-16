import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig:NextConfig = {

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increase the limit (adjust as needed)
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],

  },
};

export default nextConfig;
