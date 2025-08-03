import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://ipfs.io/ipfs/**"),
      new URL("https://cloudflare-ipfs.com/ipfs/**"),
      new URL("https://dweb.link/ipfs/**"),
    ],
  },
};

export default nextConfig;
