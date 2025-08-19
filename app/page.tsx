import { BillingModule } from "@/components/billing/billing-module"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <BillingModule />
          </div>
        </main>
      </div>
    </div>
  )
}
