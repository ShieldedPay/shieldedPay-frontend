"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { WalletModal } from "@/components/wallet/wallet-modal"
import { ZkExplainerModal } from "@/components/privacy/zk-explainer-modal"
import { MobileNav } from "@/components/admin/mobile-nav"

export function AdminHeader() {
  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <SidebarTrigger className="hidden md:inline-flex -ml-2" />
      </div>

      <Separator orientation="vertical" className="h-6 hidden md:block" />

      <div className="flex-1" />

      <div className="flex items-center gap-2.5">
        <ZkExplainerModal />
        <WalletConnectButton />
      </div>

      <WalletModal />
    </header>
  )
}
