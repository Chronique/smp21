"use client";

import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // LOGIKA AUTO-DETECT (Otomatis konek jika di Warpcast/Smart Wallet)
  useEffect(() => {
    if (!isConnected && connectors.length > 0) {
      // Coba konek otomatis ke Farcaster jika tersedia
      const farcaster = connectors.find((c) => c.id === "farcaster");
      if (farcaster) {
        connect({ connector: farcaster });
      } else {
        // Jika bukan Farcaster, coba auto-connect ke Coinbase Smart Wallet
        const coinbase = connectors.find((c) => c.id === "coinbaseWalletSDK");
        if (coinbase) connect({ connector: coinbase });
      }
    }
  }, [isConnected, connectors, connect]);

  if (isConnected && address) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
        <div className="text-left">
          <div className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Terhubung</div>
          <div className="text-sm font-black text-blue-600 font-mono">{truncateAddress(address)}</div>
        </div>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
          className="rounded-xl border-red-100 text-red-500 hover:bg-red-50"
        >
          Putus
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Tombol manual hanya muncul sebagai fallback atau untuk EOA */}
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="w-full py-7 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-200"
        >
          {isPending ? "MENGHUBUNGKAN..." : `MULAI KONEKSI ${connector.name.toUpperCase()}`}
        </Button>
      ))}
    </div>
  );
}