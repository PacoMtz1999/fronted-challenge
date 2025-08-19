import * as Yup from "yup"

export const invoiceValidationSchema = Yup.object({
  customerName: Yup.string()
    .required("El nombre del cliente es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s.,\-&]+$/, "El nombre contiene caracteres inválidos"),

  date: Yup.date()
    .required("La fecha es obligatoria")
    .max(new Date(), "La fecha no puede ser futura")
    .min(new Date("2020-01-01"), "La fecha no puede ser anterior a 2020"),

  amount: Yup.number()
    .required("El monto es obligatorio")
    .positive("El monto debe ser mayor a 0")
    .max(999999.99, "El monto no puede exceder $999,999.99")
    .test("decimal-places", "El monto no puede tener más de 2 decimales", (value) => {
      if (value === undefined) return true
      return Number.isInteger(value * 100)
    }),

  status: Yup.string().required("El estado es obligatorio").oneOf(["Pagada", "Pendiente"], "Estado inválido"),
})

export const invoiceFiltersValidationSchema = Yup.object({
  status: Yup.string().oneOf(["all", "Pagada", "Pendiente"], "Estado de filtro inválido"),
  dateFrom: Yup.date().nullable(),
  dateTo: Yup.date()
    .nullable()
    .when("dateFrom", (dateFrom, schema) => {
      return dateFrom ? schema.min(dateFrom, "La fecha 'hasta' debe ser posterior a la fecha 'desde'") : schema
    }),
  searchTerm: Yup.string().max(100, "El término de búsqueda es demasiado largo"),
})
