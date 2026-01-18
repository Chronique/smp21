import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const METADATA = {
  name: "VOTE SMP 21", // Nama yang muncul di header Farcaster
  description: "Aplikasi Pemilihan Ketua Kelas Onchain SMP 21", // Deskripsi singkat
  bannerImageUrl: 'https://smp-21-jambi.vercel.app/logo-smp21.png',
  iconImageUrl: 'https://smp-21-jambi.vercel.app/logo-smp21.png',
  // homeUrl: process.env.NEXT_PUBLIC_URL ?? 
  homeUrl: "https://smp-21-jambi.vercel.app",
  splashBackgroundColor: "#FFFFFF"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
