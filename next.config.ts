import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
