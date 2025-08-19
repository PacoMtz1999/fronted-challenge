export interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  date: string
  status: "Pagada" | "Pendiente"
  amount: number
}

export interface InvoiceFilters {
  status: "all" | "Pagada" | "Pendiente"
  dateFrom: string
  dateTo: string
  searchTerm: string
}
