// src/components/bottom-navigation.tsx
"use client";

import { Tabs, TabItem } from "@worldcoin/mini-apps-ui-kit-react";
import { 
  HowToVote, AddCircleOutline, PeopleOutline, 
  AccountCircle, Settings, Assessment 
} from "@mui/icons-material";
import { HapticWrapper } from "~/components/haptic-wrapper";

export function BottomNavigation({ activeTab, onTabChange, isAdmin, pollCreated }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-lg mx-auto">
        <Tabs value={activeTab}>
          <HapticWrapper onClick={() => onTabChange("vote")} hapticType="selection">
            <TabItem value="vote" icon={<HowToVote className="text-blue-500" />} label="Vote" />
          </HapticWrapper>

          {isAdmin && pollCreated && (
            <HapticWrapper onClick={() => onTabChange("results")} hapticType="selection">
              <TabItem value="results" icon={<Assessment className="text-green-500" />} label="Hasil" />
            </HapticWrapper>
          )}

          {isAdmin && !pollCreated && (
            <HapticWrapper onClick={() => onTabChange("create")} hapticType="selection">
              <TabItem value="create" icon={<AddCircleOutline className="text-orange-500" />} label="Mulai" />
            </HapticWrapper>
          )}

          {isAdmin && (
            <>
              <HapticWrapper onClick={() => onTabChange("admin")} hapticType="selection">
                <TabItem value="admin" icon={<PeopleOutline className="text-purple-500" />} label="Murid" />
              </HapticWrapper>
              <HapticWrapper onClick={() => onTabChange("settings")} hapticType="selection">
                <TabItem value="settings" icon={<Settings className="text-zinc-600" />} label="Setting" />
              </HapticWrapper>
            </>
          )}

          <HapticWrapper onClick={() => onTabChange("wallet")} hapticType="selection">
            <TabItem value="wallet" icon={<AccountCircle className="text-red-500" />} label="Profil" />
          </HapticWrapper>
        </Tabs>
      </div>
    </div>
  );
}