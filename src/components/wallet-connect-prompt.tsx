"use client";

import { WalletConnect } from "~/components/wallet/wallet-actions";

export function WalletConnectPrompt() {
  return (
    <div className="flex flex-col justify-center items-center text-center py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">SIAP UNTUK MEMILIH?</h2>
        <p className="text-sm text-gray-400 font-medium px-6">
          Gunakan Farcaster atau Smart Wallet untuk masuk tanpa biaya gas.
        </p>
      </div>
      <div className="w-full px-4">
        <WalletConnect />
      </div>
    </div>
  );
}