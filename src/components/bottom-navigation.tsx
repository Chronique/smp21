"use client";

import { Tabs, TabItem } from "@worldcoin/mini-apps-ui-kit-react";
import { CheckCircle, Plus, Group, Wallet } from "iconoir-react";
import { HapticWrapper } from "~/components/haptic-wrapper";

export function BottomNavigation({ activeTab, onTabChange, isAdmin, pollCreated }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 z-50">
      <div className="max-w-lg mx-auto">
        <Tabs value={activeTab}>
          <HapticWrapper onClick={() => onTabChange("vote")} hapticType="selection">
            <TabItem value="vote" icon={<CheckCircle width={20} height={20} />} label="Vote" />
          </HapticWrapper>
          {isAdmin && !pollCreated && (
            <HapticWrapper onClick={() => onTabChange("create")} hapticType="selection">
              <TabItem value="create" icon={<Plus width={20} height={20} />} label="Mulai" />
            </HapticWrapper>
          )}
          {isAdmin && (
            <HapticWrapper onClick={() => onTabChange("admin")} hapticType="selection">
              <TabItem value="admin" icon={<Group width={20} height={20} />} label="Daftar Murid" />
            </HapticWrapper>
          )}
          <HapticWrapper onClick={() => onTabChange("wallet")} hapticType="selection">
            <TabItem value="wallet" icon={<Wallet width={20} height={20} />} label="Profil" />
          </HapticWrapper>
        </Tabs>
      </div>
    </div>
  );
}