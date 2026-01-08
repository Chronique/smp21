"use client";

import { useState } from "react";
import { useSendCalls, useReadContract } from "wagmi";
import { encodeFunctionData, isAddress } from "viem";
import { CONTRACT_ADDRESS, CLASS_VOTE_ABI } from "~/app/constants";
import { Button } from "./ui/Button";

interface WhitelistManagerProps {
  onUpdate?: (newList: string[]) => void;
}

export default function WhitelistManager({ onUpdate }: WhitelistManagerProps) {
  const [input, setInput] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const { sendCalls, isPending } = useSendCalls();

  // --- 1. AMBIL DATA DARI BLOCKCHAIN (Full Whitelist) ---
  const { data: whitelistData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CLASS_VOTE_ABI,
    functionName: "getFullWhitelist",
  });

  const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL;

  // --- 2. FUNGSI TAMBAH WHITELIST (GASLESS) ---
  const handleAdd = async () => {
    if (!paymasterUrl) return alert("Paymaster URL belum diatur");

    const addresses = input
      .split(/[\n,]+/)
      .map((a) => a.trim())
      .filter((a) => isAddress(a)) as `0x${string}`[];

    if (addresses.length === 0) return alert("Alamat tidak valid!");

    try {
      sendCalls({
        calls: [
          {
            to: CONTRACT_ADDRESS as `0x${string}`,
            data: encodeFunctionData({
              abi: CLASS_VOTE_ABI,
              functionName: "addToWhitelist",
              args: [addresses],
            }),
          },
        ],
        capabilities: { paymasterService: { url: paymasterUrl } },
      });
      alert("Permintaan pendaftaran dikirim!");
      setInput("");
      setTimeout(() => refetch(), 3000); // Refresh data setelah 3 detik
    } catch (e) {
      alert("Terjadi kesalahan teknis.");
    }
  };

  // --- 3. FUNGSI UBAH JUDUL (GASLESS) ---
  const handleUpdateTitle = async () => {
    if (!paymasterUrl) return alert("Paymaster URL belum diatur");
    if (!newTitle) return alert("Judul tidak boleh kosong");

    try {
      sendCalls({
        calls: [
          {
            to: CONTRACT_ADDRESS as `0x${string}`,
            data: encodeFunctionData({
              abi: CLASS_VOTE_ABI,
              functionName: "updateTitle",
              args: [newTitle],
            }),
          },
        ],
        capabilities: { paymasterService: { url: paymasterUrl } },
      });
      alert("Judul sedang diperbarui secara gratis!");
      setNewTitle("");
    } catch (e) {
      alert("Gagal mengubah judul.");
    }
  };

  // --- 4. FUNGSI RESET (GASLESS) ---
  const handleReset = async (hapusSemuaMurid: boolean) => {
    if (!paymasterUrl) return alert("Paymaster URL belum diatur");
    if (!confirm("Apakah Anda yakin? Tindakan ini permanen.")) return;

    try {
      sendCalls({
        calls: [
          {
            to: CONTRACT_ADDRESS as `0x${string}`,
            data: encodeFunctionData({
              abi: CLASS_VOTE_ABI,
              functionName: "resetPoll",
              args: [hapusSemuaMurid],
            }),
          },
        ],
        capabilities: { paymasterService: { url: paymasterUrl } },
      });
      alert("Permintaan reset dikirim!");
      setTimeout(() => refetch(), 3000);
    } catch (e) {
      alert("Gagal melakukan reset.");
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: UBAH JUDUL */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border shadow-sm">
        <h2 className="text-xl font-black mb-4 uppercase tracking-tight">Judul Pemilihan</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Masukkan judul baru (Ketua OSIS, dll)"
            className="flex-1 p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 outline-none focus:border-blue-500"
          />
          <Button onClick={handleUpdateTitle} disabled={isPending}>
            UPDATE
          </Button>
        </div>
      </div>

      {/* SECTION 2: DAFTARKAN MURID */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border shadow-sm">
        <h2 className="text-xl font-black mb-4 uppercase tracking-tight">Daftarkan Murid</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Masukkan alamat wallet (satu per baris)"
          className="w-full h-32 p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 mb-4 text-xs font-mono outline-none"
        />
        <Button onClick={handleAdd} disabled={isPending} className="w-full py-6">
          {isPending ? "MEMPROSES..." : "SIMPAN WHITELIST"}
        </Button>
      </div>

      {/* SECTION 3: DAFTAR MURID TERDAFTAR (FETCH DARI BLOCKCHAIN) */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black uppercase">Murid Terdaftar ({whitelistData?.length || 0})</h2>
          <button onClick={() => refetch()} className="text-[10px] text-blue-500 font-bold">REFRESH</button>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {whitelistData && (whitelistData as string[]).length > 0 ? (
            (whitelistData as string[]).map((addr, i) => (
              <div key={i} className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-[10px] font-mono truncate border">
                {addr}
              </div>
            ))
          ) : (
            <p className="text-zinc-400 text-xs italic">Belum ada murid terdaftar.</p>
          )}
        </div>
      </div>

      {/* SECTION 4: KONTROL TOTAL */}
      <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 flex flex-col gap-2">
        <h3 className="text-xs font-black text-red-500 mb-2 uppercase tracking-widest">Danger Zone</h3>
        <button onClick={() => handleReset(false)} disabled={isPending} className="w-full py-3 border border-red-200 text-red-600 rounded-xl text-[10px] font-bold">
          BERSIHKAN VOTING (SIMPAN DAFTAR MURID)
        </button>
        <button onClick={() => handleReset(true)} disabled={isPending} className="w-full py-3 bg-red-600 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-red-200">
          RESET TOTAL (HAPUS SEMUA MURID)
        </button>
      </div>
    </div>
  );
}