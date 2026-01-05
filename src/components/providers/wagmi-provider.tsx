"use client";

import { createConfig, http, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors"; // Pastikan baseAccount diimpor
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { METADATA } from "../../lib/utils";

export const config = createConfig({
  chains: [base],
  ssr: true, // Dukungan untuk Next.js SSR
  multiInjectedProviderDiscovery: false, // Fokus pada Base Account
  transports: { [base.id]: http() },
  connectors: [
    farcasterMiniApp(), 
    baseAccount({
      appName: METADATA.name,
      appLogoUrl: METADATA.iconImageUrl,
    }),
    injected({ target: "metaMask" })
  ],
});

const queryClient = new QueryClient();
export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}