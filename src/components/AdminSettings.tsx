"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "~/app/constants";
import { Button } from "./ui/Button";
import { Settings, UserPlus, RefreshDouble, Trash } from "iconoir-react";

export default function AdminSettings() {
  const [newAdmin, setNewAdmin] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();

  const handleAddAdmin = async () => {
    if (!newAdmin.startsWith("0x")) return alert("Alamat tidak valid!");
    try {
      await writeContractAsync({
        abi: CLASS_VOTE_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "addAdmin",
        args: [newAdmin as `0x${string}`],
      });
      alert("Admin baru berhasil ditambahkan!");
      setNewAdmin("");
    } catch (e) { alert("Gagal menambah admin."); }
  };

  const handleReset = async (clearWhitelist: boolean) => {
    const msg = clearWhitelist 
      ? "RESET TOTAL: Ini akan menghapus kandidat DAN semua daftar murid. Lanjutkan?"
      : "RESET PEMILIHAN: Ini menghapus kandidat tapi MENYIMPAN daftar murid. Lanjutkan?";
    
    if (!confirm(msg)) return;

    try {
      await writeContractAsync({
        abi: CLASS_VOTE_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "resetPoll",
        args: [clearWhitelist],
      });
      alert("Sistem berhasil di-reset!");
    } catch (e) { alert("Gagal melakukan reset."); }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Bagian Tambah Admin */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="text-blue-500" />
          <h2 className="font-black text-gray-900 dark:text-white">Tambah Admin</h2>
        </div>
        <input 
          placeholder="0x... (Alamat Wallet)"
          className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 mb-3 text-sm"
          value={newAdmin}
          onChange={(e) => setNewAdmin(e.target.value)}
        />
        <Button onClick={handleAddAdmin} disabled={isPending} className="w-full rounded-2xl">
          Berikan Akses Admin
        </Button>
      </div>

      {/* Bagian Area Berbahaya (Reset) */}
      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-red-600">
          <Settings />
          <h2 className="font-black uppercase tracking-tighter">Area Berbahaya</h2>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => handleReset(false)}
            disabled={isPending}
            className="w-full py-4 px-4 bg-white dark:bg-zinc-950 border border-red-200 text-red-600 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
          >
            <RefreshDouble width={18} /> RESET & SIMPAN MURID
          </button>

          <button 
            onClick={() => handleReset(true)}
            disabled={isPending}
            className="w-full py-4 px-4 bg-red-600 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-red-200"
          >
            <Trash width={18} /> RESET TOTAL (HAPUS SEMUA)
          </button>
        </div>
        <p className="mt-4 text-[9px] text-red-400 text-center font-bold uppercase tracking-widest">
          Tindakan ini tidak dapat dibatalkan
        </p>
      </div>
    </div>
  );
}