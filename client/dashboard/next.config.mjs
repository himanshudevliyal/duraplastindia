/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      {
        protocol: "https",
        hostname: "duraplastapi.bwdemo.in",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
      },
    ],
  },
};

export default nextConfig;
