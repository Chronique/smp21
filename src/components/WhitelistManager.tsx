"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "~/app/constants";

export default function WhitelistManager() {
  const [input, setInput] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();

  const handleAdd = async () => {
    const addresses = input.split(/[\n,]+/).map(a => a.trim()).filter(a => a.startsWith("0x"));
    if (addresses.length === 0) return alert("Alamat tidak valid!");
    try {
      await writeContractAsync({
        abi: CLASS_VOTE_ABI, address: CONTRACT_ADDRESS,
        functionName: "addToWhitelist", args: [addresses as any],
      });
      alert("Daftar murid tersimpan di Base!");
      setInput("");
    } catch (e) { alert("Hanya Admin yang bisa mendaftarkan murid."); }
  };

  const { writeContractAsync: resetAction } = useWriteContract();

const handleReset = async (hapusSemuaMurid: boolean) => {
  if (!confirm("Apakah Anda yakin ingin menghapus data pemilihan ini?")) return;
  
  try {
    await resetAction({
      abi: CLASS_VOTE_ABI,
      address: CONTRACT_ADDRESS,
      functionName: "resetPoll",
      args: [hapusSemuaMurid],
    });
    alert("Sistem berhasil di-reset! Anda bisa membuat pemilihan baru sekarang.");
  } catch (e) {
    alert("Gagal melakukan reset.");
  }
};

<div className="mt-10 pt-6 border-t border-red-100">
  <h3 className="text-sm font-black text-red-500 mb-4 uppercase">Area Berbahaya</h3>
  <div className="flex flex-col gap-2">
    <button 
      onClick={() => handleReset(false)}
      className="w-full py-3 border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50"
    >
      RESET PEMILIHAN (SIMPAN DAFTAR MURID)
    </button>
    <button 
      onClick={() => handleReset(true)}
      className="w-full py-3 bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-100"
    >
      RESET TOTAL (HAPUS SEMUA DATA)
    </button>
  </div>
</div>

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border shadow-sm">
      <h2 className="text-xl font-bold mb-4">Daftarkan Murid</h2>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="0x123..., 0x456..." className="w-full h-32 p-4 rounded-2xl border mb-4 text-sm" />
      <button onClick={handleAdd} disabled={isPending} className="w-full py-4 bg-zinc-900 text-white font-bold rounded-2xl">
        {isPending ? "Mengirim ke Base..." : "Simpan Whitelist"}
      </button>
    </div>
  );
}