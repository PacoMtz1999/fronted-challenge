"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Receipt,
  Users,
  BarChart3,
  Settings,
  FileText,
  CreditCard,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Receipt, label: "Invoices", active: true },
  { icon: Users, label: "Customers", active: false },
  { icon: CreditCard, label: "Payments", active: false },
  { icon: BarChart3, label: "Reports", active: false },
  { icon: TrendingUp, label: "Analytics", active: false },
  { icon: FileText, label: "Documents", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn("bg-slate-900 text-white transition-all duration-300 flex flex-col", collapsed ? "w-16" : "w-64")}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!collapsed && <span className="font-semibold text-slate-200">Navigation</span>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
                  item.active && "bg-blue-600 text-white hover:bg-blue-700",
                  collapsed && "px-2",
                )}
              >
                <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-700">
        {!collapsed && (
          <div className="text-xs text-slate-400">
            <p>Version 2.1.0</p>
            <p>© 2024 CustomsCity</p>
          </div>
        )}
      </div>
    </aside>
  )
}
