"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnectBase = () => {
    // Cari konektor Base Account secara spesifik
    const baseConnector = connectors.find((c) => c.id === "baseAccount");
    if (baseConnector) {
      connect({ connector: baseConnector });
    } else {
      alert("Konektor Base Account tidak ditemukan.");
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-2xl bg-white shadow-sm w-full">
        <div className="text-left">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Terhubung</p>
          <p className="text-sm font-black text-blue-600 font-mono">{truncateAddress(address)}</p>
        </div>
        <Button onClick={() => disconnect()} variant="outline" size="sm" className="text-red-500">Putus</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <Button
        onClick={handleConnectBase}
        disabled={isPending}
        className="w-full py-7 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl"
      >
        {isPending ? "MENGHUBUNGKAN..." : "SIGN IN WITH BASE"}
      </Button>
      
      {/* Tombol MetaMask sebagai cadangan */}
      <Button
        onClick={() => {
          const mm = connectors.find(c => c.id === "metaMask");
          if (mm) connect({ connector: mm });
        }}
        className="w-full py-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-500"
      >
        Lainnya (MetaMask)
      </Button>
    </div>
  );
}