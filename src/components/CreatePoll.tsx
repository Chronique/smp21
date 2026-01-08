"use client";

import { useState } from "react";
import { useSendCalls } from "wagmi";
import { encodeFunctionData } from "viem";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "~/app/constants"; // Hapus BUILDER_CODE_HEX
import { Add, DeleteOutline, AddPhotoAlternate } from "@mui/icons-material";
import { Button } from "./ui/Button";

export default function CreatePoll({ onSuccess }: { onSuccess?: () => void }) {
  const [candidateList, setCandidateList] = useState([
    { name: "", photo: "" }, 
    { name: "", photo: "" }
  ]);
  const { sendCalls, isPending } = useSendCalls();

  const handleCreate = async () => {
    const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;
    if (!paymasterUrl) return alert("Paymaster URL tidak ditemukan!");

    // 1. Filter kandidat yang namanya tidak kosong agar sinkron
    const validCandidates = candidateList.filter(c => c.name.trim() !== "");
    
    if (validCandidates.length < 2) return alert("Minimal 2 nama kandidat harus diisi!");
    if (validCandidates.length > 5) return alert("Maksimal 5 kandidat diperbolehkan!");

    const names = validCandidates.map(c => c.name);
    const photos = validCandidates.map(c => c.photo || "https://via.placeholder.com/150");

    try {
      sendCalls({
        calls: [{
          to: CONTRACT_ADDRESS as `0x${string}`,
          // 2. FIX: Gunakan data murni tanpa BUILDER_CODE_HEX
          data: encodeFunctionData({
            abi: CLASS_VOTE_ABI,
            functionName: "createPoll",
            args: [names, photos],
          }),
        }],
        capabilities: { paymasterService: { url: paymasterUrl } }
      });
      
      alert("Pemilihan sedang diproses secara Gasless!");
      if (onSuccess) onSuccess();
    } catch (e) { 
      alert("Gagal memublikasikan pemilihan."); 
    }
  };

  // ... (Bagian return JSX tetap sama, hanya sesuaikan styling sedikit) ...
  return (
    <div className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-[28px] border shadow-sm">
      <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">Setup Kandidat</h2>
      
      <div className="space-y-4">
        {candidateList.map((c, i) => (
          <div key={i} className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-[24px] border border-zinc-100 dark:border-zinc-800 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Kandidat {i + 1}</span>
              {candidateList.length > 2 && (
                <button onClick={() => setCandidateList(candidateList.filter((_, idx) => idx !== i))}>
                  <DeleteOutline className="text-red-400" fontSize="small" />
                </button>
              )}
            </div>

            <input 
              placeholder="Nama Lengkap" 
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-2 text-sm outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
              value={c.name} 
              onChange={(e) => {
                const newList = [...candidateList]; newList[i].name = e.target.value; setCandidateList(newList);
              }}
            />

            <div className="flex items-center gap-2">
              <AddPhotoAlternate className="text-zinc-400" fontSize="small" />
              <input 
                placeholder="URL Foto (https://...)" 
                className="w-full bg-transparent py-1 text-[11px] text-zinc-500 outline-none"
                value={c.photo} 
                onChange={(e) => {
                  const newList = [...candidateList]; newList[i].photo = e.target.value; setCandidateList(newList);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {candidateList.length < 5 && (
        <button 
          onClick={() => setCandidateList([...candidateList, { name: "", photo: "" }])} 
          className="w-full py-3 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center gap-2 text-zinc-400 hover:text-blue-500 transition-colors"
        >
          <Add fontSize="small" /> <span className="text-xs font-bold">Tambah Kandidat</span>
        </button>
      )}

      <Button 
        onClick={handleCreate} 
        disabled={isPending} 
        className="w-full py-6 rounded-2xl shadow-xl"
      >
        {isPending ? "MEMPROSES..." : "MULAI PEMILIHAN (GRATIS)"}
      </Button>
      <p className="text-center text-[9px] text-zinc-400 font-bold uppercase py-2 tracking-widest">Biaya Gas Gratis</p>
    </div>
  );
}