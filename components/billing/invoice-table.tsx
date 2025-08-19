"use client"

import { useMemo } from "react"
import { AgGridReact } from "ag-grid-react"
import type { ColDef, GridReadyEvent } from "ag-grid-community"
import { useInvoiceStore } from "@/store/invoice-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Edit, Trash2, Receipt } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Invoice } from "@/types/invoice"

// Status Badge Component
function StatusBadge({ value }: { value: "Pagada" | "Pendiente" }) {
  return (
    <Badge variant={value === "Pagada" ? "default" : "secondary"} className="font-medium">
      {value}
    </Badge>
  )
}

// Amount Formatter Component
function AmountFormatter({ value }: { value: number }) {
  return (
    <span className="font-mono font-medium">
      ${value.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  )
}

// Actions Component
function ActionsRenderer({ data }: { data: Invoice }) {
  const { deleteInvoice } = useInvoiceStore()

  const handleDelete = () => {
    if (window.confirm(`¿Está seguro de eliminar la factura ${data.invoiceNumber}?`)) {
      deleteInvoice(data.id)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Receipt className="mr-2 h-4 w-4" />
          Ver Factura
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function InvoiceTable() {
  const { filteredInvoices } = useInvoiceStore()

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Número de Factura",
        field: "invoiceNumber",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
        cellClass: "font-medium",
      },
      {
        headerName: "Cliente",
        field: "customerName",
        sortable: true,
        filter: true,
        flex: 2,
        minWidth: 200,
      },
      {
        headerName: "Fecha",
        field: "date",
        sortable: true,
        filter: "agDateColumnFilter",
        flex: 1,
        minWidth: 120,
        valueFormatter: (params) => {
          const date = new Date(params.value)
          return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        },
      },
      {
        headerName: "Estado",
        field: "status",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 120,
        cellRenderer: StatusBadge,
      },
      {
        headerName: "Monto (USD)",
        field: "amount",
        sortable: true,
        filter: "agNumberColumnFilter",
        flex: 1,
        minWidth: 140,
        cellRenderer: AmountFormatter,
        cellClass: "text-right",
        headerClass: "text-right",
      },
      {
        headerName: "Acciones",
        field: "actions",
        sortable: false,
        filter: false,
        width: 80,
        pinned: "right",
        cellRenderer: ActionsRenderer,
        cellClass: "flex items-center justify-center",
      },
    ],
    [],
  )

  const defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  }

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Lista de Facturas</CardTitle>
          <div className="text-sm text-muted-foreground">
            {filteredInvoices.length} factura{filteredInvoices.length !== 1 ? "s" : ""}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
          <AgGridReact
            rowData={filteredInvoices}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
            animateRows={true}
            rowSelection="single"
            suppressRowClickSelection={true}
            getRowId={(params) => params.data.id}
          />
        </div>
      </CardContent>
    </Card>
  )
}
