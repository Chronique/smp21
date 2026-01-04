"use client";

import { Tabs, TabItem } from "@worldcoin/mini-apps-ui-kit-react";
import { CheckCircle, Plus, Group, Wallet, Settings } from "iconoir-react"; // Tambahkan Settings di sini
import { HapticWrapper } from "~/components/haptic-wrapper";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  isAdmin: boolean;
  pollCreated: boolean;
}

export function BottomNavigation({ activeTab, onTabChange, isAdmin, pollCreated }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 z-50">
      <div className="max-w-lg mx-auto">
        <Tabs value={activeTab}>
          {/* Tombol Vote */}
          <HapticWrapper onClick={() => onTabChange("vote")} hapticType="selection">
            <TabItem value="vote" icon={<CheckCircle width={20} height={20} />} label="Vote" />
          </HapticWrapper>

          {/* Tombol Mulai (Hanya Admin & Jika Poll belum ada) */}
          {isAdmin && !pollCreated && (
            <HapticWrapper onClick={() => onTabChange("create")} hapticType="selection">
              <TabItem value="create" icon={<Plus width={20} height={20} />} label="Mulai" />
            </HapticWrapper>
          )}

          {/* Tombol Daftar Murid & Setting (Hanya Admin) */}
          {isAdmin && (
            <>
              <HapticWrapper onClick={() => onTabChange("admin")} hapticType="selection">
                <TabItem value="admin" icon={<Group width={20} height={20} />} label="Murid" />
              </HapticWrapper>
              <HapticWrapper onClick={() => onTabChange("settings")} hapticType="selection">
                <TabItem value="settings" icon={<Settings width={20} height={20} />} label="Setting" />
              </HapticWrapper>
            </>
          )}

          {/* Tombol Profil */}
          <HapticWrapper onClick={() => onTabChange("wallet")} hapticType="selection">
            <TabItem value="wallet" icon={<Wallet width={20} height={20} />} label="Profil" />
          </HapticWrapper>
        </Tabs>
      </div>
    </div>
  );
}