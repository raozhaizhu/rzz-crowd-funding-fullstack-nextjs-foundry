"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, sepolia } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "Rzz Crowd Funding",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [anvil, sepolia],
  ssr: true,
});

export default config;
