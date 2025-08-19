"use client"

import { useState } from "react"
import { InvoiceTable } from "./invoice-table"
import { InvoiceForm } from "./invoice-form"
import { InvoiceFilters } from "./invoice-filters"
import { InvoiceStats } from "./invoice-stats"
import { CSVImport } from "./csv-import"
import { Button } from "@/components/ui/button"
import { Plus, Download, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function BillingModule() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Invoice Management</h1>
            <p className="text-slate-600 mt-1">Manage and track all your invoices in one place</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => setIsCSVImportOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <InvoiceForm onClose={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <InvoiceStats />

      {/* Filters */}
      <InvoiceFilters />

      {/* Invoice Table */}
      <InvoiceTable />

      <CSVImport isOpen={isCSVImportOpen} onClose={() => setIsCSVImportOpen(false)} />
    </div>
  )
}
