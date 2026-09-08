import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/lugares",
        destination: "/viajes",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xxqekpyvyrhbxueqezaf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/post-images/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
