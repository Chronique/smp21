"use client";

import React, { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "~/app/constants";
import { TopBar } from "~/components/top-bar";
import { BottomNavigation } from "~/components/bottom-navigation";
import { WalletConnectPrompt } from "~/components/wallet-connect-prompt";

import VoteCard from "./VoteCard";
import CreatePoll from "./CreatePoll";
import WhitelistManager from "./WhitelistManager";

export default function Demo() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<string>("vote");

  const { data: pollCreated, refetch: refetchStatus } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "pollCreated",
  });

  const { data: adminAddress } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "admin",
  });

  const isAdmin = address?.toLowerCase() === (adminAddress as string)?.toLowerCase();

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="px-4 py-4"><TopBar /></div>
      <div className="px-4 pb-24">
        {!isConnected ? (
          <WalletConnectPrompt />
        ) : (
          <>
            {activeTab === "vote" && (
              pollCreated ? <VoteCard /> : 
              <div className="text-center p-12 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed text-gray-400">
                <p className="font-bold">Belum ada pemilihan aktif.</p>
                <p className="text-[10px] uppercase mt-2">Hubungi guru untuk memulai</p>
              </div>
            )}
            {activeTab === "create" && isAdmin && <CreatePoll onSuccess={refetchStatus} />}
            {activeTab === "admin" && isAdmin && <WhitelistManager />}
            {activeTab === "wallet" && (
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm">
                <h3 className="font-bold mb-4">Profil Pemilih</h3>
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Alamat Dompet</p>
                  <p className="text-xs text-blue-600 break-all bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl">{address}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={(tab: any) => setActiveTab(tab)}
        isAdmin={isAdmin}
        pollCreated={!!pollCreated}
      />
    </div>
  );
}