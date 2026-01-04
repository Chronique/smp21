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