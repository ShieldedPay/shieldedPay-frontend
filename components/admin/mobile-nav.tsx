"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Shield,
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  TrendingUp,
  Settings,
  HelpCircle,
} from "lucide-react"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { ZkExplainerModal } from "@/components/privacy/zk-explainer-modal"

const NAV_ITEMS = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Employees", href: "/admin/employees", icon: Users },
  { title: "Payroll", href: "/admin/payroll", icon: FileText },
  { title: "Treasury", href: "/admin/treasury", icon: Wallet },
  { title: "Compliance", href: "/admin/compliance", icon: Shield },
  { title: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { title: "Settings", href: "/admin/settings", icon: Settings },
  { title: "Help", href: "/admin/help", icon: HelpCircle },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="p-5 border-b text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <SheetTitle className="text-base font-semibold">ShieldedPay</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t space-y-3 bg-muted/20">
          <div className="flex justify-center">
            <WalletConnectButton />
          </div>
          <div className="flex justify-center">
            <ZkExplainerModal />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
