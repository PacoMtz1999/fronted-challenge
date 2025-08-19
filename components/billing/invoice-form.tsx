"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useInvoiceStore } from "@/store/invoice-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Save, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InvoiceFormProps {
  onClose: () => void
}

interface FormValues {
  customerName: string
  date: string
  amount: string
  status: "Pagada" | "Pendiente"
}

const validationSchema = Yup.object({
  customerName: Yup.string()
    .required("El nombre del cliente es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  date: Yup.date().required("La fecha es obligatoria").max(new Date(), "La fecha no puede ser futura"),
  amount: Yup.number()
    .required("El monto es obligatorio")
    .positive("El monto debe ser mayor a 0")
    .max(999999.99, "El monto no puede exceder $999,999.99"),
  status: Yup.string().required("El estado es obligatorio").oneOf(["Pagada", "Pendiente"], "Estado inválido"),
})

export function InvoiceForm({ onClose }: InvoiceFormProps) {
  const { addInvoice, generateInvoiceNumber } = useInvoiceStore()

  const initialValues: FormValues = {
    customerName: "",
    date: new Date().toISOString().split("T")[0], // Today's date
    amount: "",
    status: "Pendiente",
  }

  const handleSubmit = async (values: FormValues) => {
    try {
      const invoiceNumber = generateInvoiceNumber()

      addInvoice({
        invoiceNumber,
        customerName: values.customerName.trim(),
        date: values.date,
        amount: Number.parseFloat(values.amount),
        status: values.status,
      })

      onClose()
    } catch (error) {
      console.error("Error creating invoice:", error)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-6">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm font-medium">
                  Nombre del Cliente *
                </Label>
                <Field
                  as={Input}
                  id="customerName"
                  name="customerName"
                  placeholder="Ej: Empresa ABC S.A."
                  className={errors.customerName && touched.customerName ? "border-destructive" : ""}
                />
                <ErrorMessage name="customerName">
                  {(msg) => (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Fecha *
                </Label>
                <Field
                  as={Input}
                  id="date"
                  name="date"
                  type="date"
                  className={errors.date && touched.date ? "border-destructive" : ""}
                />
                <ErrorMessage name="date">
                  {(msg) => (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Monto (USD) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Field
                    as={Input}
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999.99"
                    placeholder="0.00"
                    className={`pl-8 ${errors.amount && touched.amount ? "border-destructive" : ""}`}
                  />
                </div>
                <ErrorMessage name="amount">
                  {(msg) => (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Estado *</Label>
                <Select
                  value={values.status}
                  onValueChange={(value: "Pagada" | "Pendiente") => setFieldValue("status", value)}
                >
                  <SelectTrigger className={errors.status && touched.status ? "border-destructive" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Pagada">Pagada</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage name="status">
                  {(msg) => (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* Preview */}
              {values.customerName && values.amount && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Vista previa:</strong> Se creará la factura{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-sm">{generateInvoiceNumber()}</code> para{" "}
                    <strong>{values.customerName}</strong> por{" "}
                    <strong>
                      ${Number.parseFloat(values.amount || "0").toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                    </strong>
                  </AlertDescription>
                </Alert>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Guardando..." : "Crear Factura"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}
