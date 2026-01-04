/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "~/components/ui/Button"; // Menggunakan 'B' besar sesuai nama file Anda
import { useState, ChangeEvent, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage, useConfig } from "wagmi";
import { verifyMessage } from "@wagmi/core";
import { generateSiweNonce } from "viem/siwe";
import { SiweMessage } from "siwe";
import { truncateAddress } from "~/lib/truncateAddress";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Jika sudah terhubung, tampilkan status dan tombol putus koneksi
  if (isConnected && address) {
    return (
      <div className="flex items-center justify-between p-4 border border-border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
        <div className="text-left">
          <div className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Dompet Terhubung</div>
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

  // Pilih hanya satu connector utama (biasanya Coinbase Wallet atau yang pertama terdeteksi)
  const mainConnector = connectors[0];

  return (
    <div className="w-full">
      {mainConnector ? (
        <Button
          key={mainConnector.uid}
          onClick={() => connect({ connector: mainConnector })}
          className="w-full py-7 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-200"
        >
          MULAI KONEKSI DOMPET
        </Button>
      ) : (
        <p className="text-xs text-center text-gray-400 italic font-medium">
          Tidak ada dompet terdeteksi. Silakan buka di Warpcast.
        </p>
      )}
    </div>
  );
}

// Komponen utilitas lain tetap dipertahankan jika dibutuhkan nantinya
export function SignSiweMessage() {
  const config = useConfig();
  const { address, chain } = useAccount();
  const { signMessage, data: signature, isPending } = useSignMessage();
  const [lastMessage, setLastMessage] = useState<SiweMessage | null>(null);
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; error?: string } | null>(null);

  useEffect(() => {
    const verifySignature = async () => {
      if (!signature || !lastMessage || !address || !chain) return;
      try {
        const isValid = await verifyMessage(config, {
          address,
          message: lastMessage.prepareMessage(),
          signature,
          chainId: chain.id,
        });
        setVerifyResult({ success: isValid });
      } catch (error) {
        setVerifyResult({ success: false, error: 'Gagal verifikasi' });
      }
    };
    verifySignature();
  }, [signature, lastMessage, address, chain, config]);

  const handleSignSiwe = () => {
    if (!address || !chain) return;
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Masuk ke Aplikasi Voting SMP 21",
      uri: window.location.origin,
      version: "1",
      chainId: chain.id,
      nonce: generateSiweNonce(),
    });
    setLastMessage(message);
    signMessage({ message: message.prepareMessage() });
  };

  return (
    <div className="space-y-3">
      <Button onClick={handleSignSiwe} disabled={isPending || !address || !chain} className="w-full">
        {isPending ? "Menandatangani..." : "Verifikasi Identitas (SIWE)"}
      </Button>
    </div>
  );
}