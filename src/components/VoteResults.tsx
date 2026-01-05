"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "~/app/constants";

/**
 * Helper untuk menentukan warna bar berdasarkan persentase suara.
 * Memberikan kesan visual cepat (Merah = Rendah, Hijau = Tinggi).
 */
const getProgressColor = (percentage: number) => {
  if (percentage < 30) return "bg-red-500"; 
  if (percentage < 70) return "bg-yellow-400";
  return "bg-green-500";
};

export default function ResultsPage() {
  // 1. Ambil Judul Pemilihan Dinamis dari Blockchain
  const { data: pollTitle } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "pollTitle",
  });

  // 2. Ambil Data Kandidat
  const { data: candidates } = useReadContract({
    abi: CLASS_VOTE_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "getCandidates",
  });

  if (!candidates || (candidates as any[]).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-400">
        <p className="font-bold uppercase text-xs tracking-widest">Belum Ada Pemilihan Aktif</p>
      </div>
    );
  }

  const candidatesData = candidates as any[];
  
  // 3. Hitung Total Suara (Konversi BigInt ke Number agar bisa dijumlahkan)
  const totalVotes = candidatesData.reduce((acc, curr) => acc + Number(curr.voteCount), 0);

  return (
    <div className="pb-24 p-6 animate-in fade-in duration-700">
      {/* HEADER HASIL */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-blue-900 dark:text-blue-400 uppercase tracking-tighter leading-none">
          {pollTitle as string || "HASIL PEMILIHAN"}
        </h2>
        <div className="mt-2 inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            Total: {totalVotes} Suara Masuk
          </p>
        </div>
      </div>

      {/* CONTAINER BAR VERTIKAL (Material Design 3 Style) */}
      <div className="flex flex-row justify-around items-end h-80 px-4 py-8 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        
        {candidatesData.map((c, i) => {
          const voteCount = Number(c.voteCount);
          
          // 4. ANTI-NAN LOGIC: Jika suara masih 0, set persentase ke 0
          const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
          const colorClass = getProgressColor(percentage);

          return (
            <div key={i} className="flex flex-col items-center justify-end h-full w-20 gap-4 group">
               
              {/* Tooltip Persentase */}
              <span className={`text-[11px] font-black transition-all duration-500 ${percentage > 0 ? colorClass.replace("bg-", "text-") : "text-zinc-300"}`}>
                {percentage}%
              </span>

              {/* Batang Progress Vertikal */}
              <div className="relative w-10 h-full bg-zinc-50 dark:bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-700/50 shadow-inner">
                <div 
                  className={`absolute bottom-0 left-0 w-full rounded-full transition-all duration-1000 ease-out ${colorClass} shadow-lg`}
                  style={{ height: `${percentage}%` }}
                >
                  {/* Glassmorphism Effect pada Bar */}
                  {percentage > 0 && (
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1/2 h-full bg-white/20 rounded-full blur-[2px]"></div>
                  )}
                </div>
              </div>

              {/* Info Kandidat */}
              <div className="text-center">
                <h3 className="font-black text-[10px] text-zinc-800 dark:text-zinc-200 uppercase truncate w-20">
                  {c.name}
                </h3>
                <p className="text-[9px] font-bold text-zinc-400">
                  {voteCount} VOTE
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[8px] text-zinc-400 font-bold uppercase mt-8 tracking-[0.3em]">
        Verified On-Chain Data • Base Network
      </p>
    </div>
  );
}