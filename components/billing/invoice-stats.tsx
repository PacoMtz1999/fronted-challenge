"use client"

import { useInvoiceStore } from "@/store/invoice-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, DollarSign, Clock, CheckCircle, TrendingUp } from "lucide-react"

export function InvoiceStats() {
  const { invoices } = useInvoiceStore()

  const stats = {
    total: invoices.length,
    paid: invoices.filter((inv) => inv.status === "Pagada").length,
    pending: invoices.filter((inv) => inv.status === "Pendiente").length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: invoices.filter((inv) => inv.status === "Pagada").reduce((sum, inv) => sum + inv.amount, 0),
  }

  const statCards = [
    {
      title: "Total Invoices",
      value: stats.total.toString(),
      icon: Receipt,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Paid Invoices",
      value: stats.paid.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Invoices",
      value: stats.pending.toString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalAmount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Collected Amount",
      value: `$${stats.paidAmount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
