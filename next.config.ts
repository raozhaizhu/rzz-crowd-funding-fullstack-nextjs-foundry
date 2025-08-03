import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "dweb.link",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "harlequin-advanced-bobolink-516.mypinata.cloud",
        pathname: "/ipfs/**",
      },
    ],
    domains: [
      "ipfs.io",
      "gateway.pinata.cloud",
      "nftstorage.link",
      "dweb.link",
    ],
  },
};

export default nextConfig;
