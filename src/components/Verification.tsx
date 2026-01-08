"use client";

// FIX: Tambahkan useEffect ke dalam import
import { useEffect } from "react"; 
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "~/app/constants";
import { CheckCircle, RadioButtonUnchecked, PlaylistAddCheck } from "@mui/icons-material";

/**
 * Komponen Kecil untuk mengecek status per-alamat murid
 */
function VoterStatus({ address, pollId }: { address: string; pollId: bigint }) {
  const { data: hasVoted } = useReadContract({
    abi: CLASS_VOTE_ABI,
    // FIX: Pastikan casting ke 0x${string}
    address: CONTRACT_ADDRESS as `0x${string}`, 
    functionName: "hasVotedInPoll",
    args: [pollId, address as `0x${string}`], 
  });

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border mb-2 shadow-sm transition-all hover:border-teal-200">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Alamat Whitelist</span>
        <span className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">
          {`${address.slice(0, 10)}...${address.slice(-8)}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {hasVoted ? (
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-tight">Sudah Memilih</span>
            <CheckCircle className="text-sm" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-tight text-zinc-400">Belum Memilih</span>
            <RadioButtonUnchecked className="text-sm" />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Komponen Utama Tab Verifikasi
 */
export function Verification({ whitelist }: { whitelist: string[] }) {
  const { data: currentPollId, refetch: refetchId } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "pollId",
  });

  // Jalankan refetch saat komponen pertama kali muncul
  useEffect(() => {
    if (refetchId) refetchId();
  }, [refetchId]);

  const activePollId = typeof currentPollId === 'bigint' ? currentPollId : BigInt(0);

  return (
    <div className="p-6 pb-24 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-3">
          <PlaylistAddCheck className="text-teal-600" fontSize="medium" />
        </div>
        <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
          Verifikasi Suara
        </h2>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">
          Sinkronisasi dengan Poll ID: #{activePollId.toString()}
        </p>
      </div>

      {whitelist.length === 0 ? (
        <div className="text-center p-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
            Daftar Whitelist Kosong
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {whitelist.map((addr, i) => (
            <VoterStatus 
              key={i} 
              address={addr} 
              pollId={activePollId} 
            />
          ))}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em]">
          Data Transparan Blockchain Base
        </p>
      </div>
    </div>
  );
}