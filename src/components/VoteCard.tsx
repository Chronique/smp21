"use client";

import { useState } from "react";
import { useReadContract, useSendCalls } from "wagmi";
import { encodeFunctionData } from "viem";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI, BUILDER_CODE_HEX } from "~/app/constants";
import { HowToVote } from "@mui/icons-material";

export default function VoteCard() {
  const { sendCalls, isPending } = useSendCalls();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: candidates, refetch } = useReadContract({
    abi: CLASS_VOTE_ABI, 
    address: CONTRACT_ADDRESS, 
    functionName: "getCandidates",
  });

  const { data: pollTitle } = useReadContract({
    abi: CLASS_VOTE_ABI, 
    address: CONTRACT_ADDRESS, 
    functionName: "pollTitle",
  });

  // Fungsi untuk membuka modal konfirmasi
  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  // Fungsi eksekusi transaksi (Tanpa Alert Menengah)
  const executeVote = async () => {
    if (selectedIndex === null) return;
    
    const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;
    if (!paymasterUrl) return;

    try {
      sendCalls({
        calls: [{
          to: CONTRACT_ADDRESS as `0x${string}`,
          data: `${encodeFunctionData({
            abi: CLASS_VOTE_ABI,
            functionName: "vote",
            args: [BigInt(selectedIndex)]
          })}${BUILDER_CODE_HEX}` as `0x${string}`,
        }],
        capabilities: { paymasterService: { url: paymasterUrl } }
      });
      
      // Langsung tutup modal agar jendela transaksi (Wallet) bisa muncul tanpa halangan
      setIsModalOpen(false); 
      
      // Refetch data setelah beberapa detik untuk memperbarui UI
      setTimeout(() => refetch(), 3000);
    } catch (e) { 
      // Alert hanya muncul jika benar-benar ada kesalahan teknis
      alert("Gagal mengirim suara. Silakan periksa koneksi."); 
      setIsModalOpen(false);
    }
  };

  if (!candidates || (candidates as any).length === 0) return null;

  const selectedCandidate = selectedIndex !== null ? (candidates as any[])[selectedIndex] : null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-center text-blue-600 mb-6 uppercase tracking-tight">
        {pollTitle as string || "MEMUAT JUDUL..."}
      </h2>

      {/* LIST KANDIDAT */}
      {(candidates as any[]).map((c, i) => (
        <div key={i} className="bg-white p-4 rounded-[28px] border flex items-center gap-4 shadow-sm">
          <img 
            src={c.photoUrl || "https://via.placeholder.com/150"} 
            className="w-20 h-20 rounded-2xl object-cover border" 
            alt={c.name} 
          />
          <div className="flex-1">
            <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight">{c.name}</h3>
          </div>
          <button 
            onClick={() => openModal(i)} 
            disabled={isPending} 
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs active:scale-95 transition-all disabled:bg-blue-300"
          >
            PILIH
          </button>
        </div>
      ))}

      <p className="text-center text-[9px] text-gray-400 font-bold uppercase py-4 tracking-widest">
        Biaya Gas ditanggung Sekolah (Paymaster)
      </p>

      {/* MODAL KONFIRMASI (CENTERED POP-UP) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isPending && setIsModalOpen(false)} />
          
          <div className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <HowToVote className="text-blue-600" fontSize="large" />
              </div>
              
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-tight">
                Konfirmasi Pilihan
              </h3>
              <p className="mt-2 text-sm text-zinc-500 font-medium leading-relaxed">
                Apakah Anda yakin ingin memilih <br/>
                <span className="font-black text-blue-600 text-lg uppercase">"{selectedCandidate?.name}"</span>?
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={executeVote}
                disabled={isPending} // Matikan tombol selama loading
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:bg-blue-400"
              >
                {/* TAMPILAN STATUS LOADING */}
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    MENGIRIM...
                  </span>
                ) : "YA, SAYA YAKIN"}
              </button>
              
              {!isPending && (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl font-bold text-sm"
                >
                  BATAL
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}