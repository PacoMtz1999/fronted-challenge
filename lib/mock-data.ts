import type { Invoice } from "@/types/invoice"

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    customerName: "Empresa ABC S.A.",
    date: "2024-01-15",
    status: "Pagada",
    amount: 1250.0,
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    customerName: "Comercial XYZ Ltda.",
    date: "2024-01-18",
    status: "Pendiente",
    amount: 850.5,
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    customerName: "Servicios DEF Corp.",
    date: "2024-01-20",
    status: "Pagada",
    amount: 2100.75,
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    customerName: "Industrias GHI S.A.",
    date: "2024-01-22",
    status: "Pendiente",
    amount: 675.25,
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    customerName: "Distribuidora JKL",
    date: "2024-01-25",
    status: "Pagada",
    amount: 1890.0,
  },
]
