"use client";
// ANCHOR React & library
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import config from "@/configs/rainbowkit-config";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

// ANCHOR Components

// ANCHOR Types & Interfaces

// ANCHOR Constants

// ANCHOR Component definition
const Providers = ({ children }: { children: ReactNode }) => {
  // ANCHOR Hooks (state, ref, effect, etc.)
  const [queryClient] = useState(() => new QueryClient());
  // ANCHOR Derived values (memo, callback)

  // ANCHOR Event handlers

  // ANCHOR Render helpers (optional functions returning JSX)
  // ANCHOR Render
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme({ borderRadius: "medium" })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
export default Providers;
