"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useInvoiceStore } from "@/store/invoice-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CSVImportProps {
  isOpen: boolean
  onClose: () => void
}

interface ParsedInvoice {
  invoiceNumber: string
  customerName: string
  date: string
  status: "Pagada" | "Pendiente"
  amount: number
  errors: string[]
  isValid: boolean
}

export function CSVImport({ isOpen, onClose }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedInvoice[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addInvoice, generateInvoiceNumber } = useInvoiceStore()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  const parseCSV = async (file: File) => {
    setIsProcessing(true)
    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

      // Expected headers: customer_name, date, amount, status
      const requiredHeaders = ["customer_name", "date", "amount", "status"]
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
      }

      const parsed: ParsedInvoice[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const row: any = {}

        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })

        const errors: string[] = []
        let isValid = true

        // Validate customer name
        if (!row.customer_name || row.customer_name.length < 2) {
          errors.push("Customer name is required and must be at least 2 characters")
          isValid = false
        }

        // Validate date
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!row.date || !dateRegex.test(row.date)) {
          errors.push("Date must be in YYYY-MM-DD format")
          isValid = false
        }

        // Validate amount
        const amount = Number.parseFloat(row.amount)
        if (isNaN(amount) || amount <= 0) {
          errors.push("Amount must be a positive number")
          isValid = false
        }

        // Validate status
        if (!["Pagada", "Pendiente"].includes(row.status)) {
          errors.push('Status must be either "Pagada" or "Pendiente"')
          isValid = false
        }

        parsed.push({
          invoiceNumber: generateInvoiceNumber(),
          customerName: row.customer_name,
          date: row.date,
          status: row.status as "Pagada" | "Pendiente",
          amount: amount,
          errors,
          isValid,
        })
      }

      setParsedData(parsed)
      setStep("preview")
    } catch (error) {
      console.error("CSV parsing error:", error)
      alert(`Error parsing CSV: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = () => {
    const validInvoices = parsedData.filter((item) => item.isValid)

    validInvoices.forEach((item) => {
      addInvoice({
        invoiceNumber: item.invoiceNumber,
        customerName: item.customerName,
        date: item.date,
        status: item.status,
        amount: item.amount,
      })
    })

    setStep("complete")
  }

  const downloadTemplate = () => {
    const csvContent =
      "customer_name,date,amount,status\n" +
      "Empresa ABC S.A.,2024-01-15,1250.00,Pagada\n" +
      "Comercial XYZ Ltda.,2024-01-18,850.50,Pendiente\n" +
      "Servicios DEF Corp.,2024-01-20,2100.75,Pagada"

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "invoice_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetImport = () => {
    setFile(null)
    setParsedData([])
    setStep("upload")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validCount = parsedData.filter((item) => item.isValid).length
  const errorCount = parsedData.length - validCount

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Invoices from CSV
          </DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-6">
            {/* Template Download */}
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Download our CSV template to ensure your data is formatted correctly.
                <Button variant="link" onClick={downloadTemplate} className="ml-2 p-0 h-auto">
                  <Download className="h-4 w-4 mr-1" />
                  Download Template
                </Button>
              </AlertDescription>
            </Alert>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload CSV File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csvFile">Select CSV File</Label>
                  <Input
                    ref={fileInputRef}
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="mt-2"
                  />
                </div>

                {file && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-slate-600" />
                      <span className="font-medium">{file.name}</span>
                      <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-slate-600">Processing CSV file...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Required Format */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required CSV Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div>customer_name,date,amount,status</div>
                  <div>Empresa ABC S.A.,2024-01-15,1250.00,Pagada</div>
                  <div>Comercial XYZ Ltda.,2024-01-18,850.50,Pendiente</div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>
                    <strong>customer_name:</strong> Customer company name (required)
                  </p>
                  <p>
                    <strong>date:</strong> Invoice date in YYYY-MM-DD format (required)
                  </p>
                  <p>
                    <strong>amount:</strong> Invoice amount as decimal number (required)
                  </p>
                  <p>
                    <strong>status:</strong> Either "Pagada" or "Pendiente" (required)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Import Preview</h3>
                <p className="text-slate-600">Review the data before importing</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {validCount} Valid
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errorCount} Errors
                  </Badge>
                )}
              </div>
            </div>

            {/* Data Preview */}
            <Card>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Invoice #</th>
                        <th className="text-left p-3 font-medium">Customer</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Amount</th>
                        <th className="text-left p-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.map((item, index) => (
                        <tr key={index} className={`border-b ${!item.isValid ? "bg-red-50" : ""}`}>
                          <td className="p-3">
                            {item.isValid ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            )}
                          </td>
                          <td className="p-3 font-mono text-sm">{item.invoiceNumber}</td>
                          <td className="p-3">{item.customerName}</td>
                          <td className="p-3">{item.date}</td>
                          <td className="p-3">${item.amount.toFixed(2)}</td>
                          <td className="p-3">
                            <Badge variant={item.status === "Pagada" ? "default" : "secondary"}>{item.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Errors */}
            {errorCount > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{errorCount} rows have errors and will be skipped:</strong>
                  <ul className="mt-2 space-y-1">
                    {parsedData
                      .filter((item) => !item.isValid)
                      .map((item, index) => (
                        <li key={index} className="text-sm">
                          Row {parsedData.indexOf(item) + 2}: {item.errors.join(", ")}
                        </li>
                      ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={resetImport}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={validCount === 0}>
                <Upload className="h-4 w-4 mr-2" />
                Import {validCount} Invoice{validCount !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Import Complete!</h3>
              <p className="text-slate-600 mt-2">
                Successfully imported {validCount} invoice{validCount !== 1 ? "s" : ""} from your CSV file.
              </p>
            </div>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
