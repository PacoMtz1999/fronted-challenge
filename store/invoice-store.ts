import { create } from "zustand"
import type { Invoice, InvoiceFilters } from "@/types/invoice"
import { mockInvoices } from "@/lib/mock-data"

interface InvoiceState {
  invoices: Invoice[]
  filters: InvoiceFilters
  filteredInvoices: Invoice[]

  // Actions
  addInvoice: (invoice: Omit<Invoice, "id">) => void
  bulkImportInvoices: (invoices: Omit<Invoice, "id">[]) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  setFilters: (filters: Partial<InvoiceFilters>) => void
  applyFilters: () => void
  generateInvoiceNumber: () => string
}

const defaultFilters: InvoiceFilters = {
  status: "all",
  dateFrom: "",
  dateTo: "",
  searchTerm: "",
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: mockInvoices,
  filters: defaultFilters,
  filteredInvoices: mockInvoices,

  addInvoice: (invoiceData) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
    }

    set((state) => {
      const updatedInvoices = [...state.invoices, newInvoice]
      return {
        invoices: updatedInvoices,
        filteredInvoices: filterInvoices(updatedInvoices, state.filters),
      }
    })
  },

  bulkImportInvoices: (invoicesData) => {
    const newInvoices: Invoice[] = invoicesData.map((invoiceData, index) => ({
      ...invoiceData,
      id: (Date.now() + index).toString(),
    }))

    set((state) => {
      const updatedInvoices = [...state.invoices, ...newInvoices]
      return {
        invoices: updatedInvoices,
        filteredInvoices: filterInvoices(updatedInvoices, state.filters),
      }
    })
  },

  updateInvoice: (id, updates) => {
    set((state) => {
      const updatedInvoices = state.invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, ...updates } : invoice,
      )
      return {
        invoices: updatedInvoices,
        filteredInvoices: filterInvoices(updatedInvoices, state.filters),
      }
    })
  },

  deleteInvoice: (id) => {
    set((state) => {
      const updatedInvoices = state.invoices.filter((invoice) => invoice.id !== id)
      return {
        invoices: updatedInvoices,
        filteredInvoices: filterInvoices(updatedInvoices, state.filters),
      }
    })
  },

  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters }
      return {
        filters: updatedFilters,
        filteredInvoices: filterInvoices(state.invoices, updatedFilters),
      }
    })
  },

  applyFilters: () => {
    const { invoices, filters } = get()
    set({ filteredInvoices: filterInvoices(invoices, filters) })
  },

  generateInvoiceNumber: () => {
    const { invoices } = get()
    const currentYear = new Date().getFullYear()
    const invoicesThisYear = invoices.filter((inv) => inv.invoiceNumber.includes(currentYear.toString()))
    const nextNumber = invoicesThisYear.length + 1
    return `INV-${currentYear}-${nextNumber.toString().padStart(3, "0")}`
  },
}))

// Helper function to filter invoices
function filterInvoices(invoices: Invoice[], filters: InvoiceFilters): Invoice[] {
  return invoices.filter((invoice) => {
    // Status filter
    if (filters.status !== "all" && invoice.status !== filters.status) {
      return false
    }

    // Date range filter
    if (filters.dateFrom && invoice.date < filters.dateFrom) {
      return false
    }
    if (filters.dateTo && invoice.date > filters.dateTo) {
      return false
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.customerName.toLowerCase().includes(searchLower)
      )
    }

    return true
  })
}
