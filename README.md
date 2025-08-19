# CustomsCity Billing Module

## 📋 Descripción del Proyecto

Módulo de facturación desarrollado para el Departamento de Contabilidad de CustomsCity. Esta aplicación frontend proporciona una interfaz completa para la gestión de facturas con funcionalidades avanzadas de filtrado, formularios de validación y importación de datos.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

- **📊 Tabla de Facturas con AG Grid**
  - Visualización profesional de datos con paginación
  - Ordenamiento y filtrado por columnas
  - Renderizado personalizado para estados y montos
  - Acciones contextuales (editar, eliminar, ver detalles)

- **📝 Formulario de Facturas con Formik + Yup**
  - Validación en tiempo real de todos los campos
  - Manejo de errores y mensajes informativos
  - Vista previa de datos antes de guardar
  - Soporte para creación y edición de facturas

- **🗂️ Gestión de Estado con Zustand**
  - Store centralizado para manejo de facturas
  - Filtros reactivos y búsqueda en tiempo real
  - Persistencia de estado durante la sesión

- **🎨 Diseño Profesional CoreUI Pro**
  - Interfaz empresarial con sidebar navegable
  - Dashboard con estadísticas en tiempo real
  - Paleta de colores profesional
  - Componentes consistentes y accesibles

- **📤 Importación CSV (Bonus)**
  - Carga masiva de facturas desde archivos CSV
  - Validación de datos importados
  - Vista previa antes de confirmar importación
  - Descarga de plantilla CSV de ejemplo

## 🛠️ Tecnologías Utilizadas

### Frontend Framework
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de utilidades CSS

### Componentes y UI
- **shadcn/ui** - Sistema de componentes base
- **AG Grid Community** - Tabla de datos avanzada
- **Lucide React** - Iconografía profesional

### Gestión de Estado y Formularios
- **Zustand** - Store de estado ligero y reactivo
- **Formik** - Manejo de formularios
- **Yup** - Validación de esquemas

### Utilidades
- **date-fns** - Manipulación de fechas
- **Papa Parse** - Procesamiento de archivos CSV
- **clsx** - Utilidad para clases condicionales

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <repository-url>
cd billing-module
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
# o
yarn install
\`\`\`

3. **Ejecutar en modo desarrollo**
\`\`\`bash
npm run dev
# o
yarn dev
\`\`\`

4. **Abrir en el navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
├── app/
│   ├── layout.tsx          # Layout principal de la aplicación
│   ├── page.tsx            # Página principal con el módulo de facturación
│   └── globals.css         # Estilos globales y variables CSS
├── components/
│   ├── billing/
│   │   ├── billing-module.tsx    # Componente principal del módulo
│   │   ├── invoice-table.tsx     # Tabla AG Grid de facturas
│   │   ├── invoice-form.tsx      # Formulario Formik de facturas
│   │   ├── invoice-filters.tsx   # Componente de filtros
│   │   ├── invoice-stats.tsx     # Dashboard de estadísticas
│   │   └── csv-import.tsx        # Importador CSV
│   ├── layout/
│   │   ├── header.tsx            # Cabecera de la aplicación
│   │   └── sidebar.tsx           # Barra lateral de navegación
│   └── ui/                       # Componentes base de shadcn/ui
├── store/
│   └── invoice-store.ts          # Store Zustand para facturas
├── types/
│   └── invoice.ts                # Interfaces TypeScript
├── lib/
│   ├── utils.ts                  # Utilidades generales
│   ├── validation-schemas.ts     # Esquemas de validación Yup
│   └── mock-data.ts              # Datos de prueba
└── package.json                  # Dependencias y scripts
\`\`\`

## 🎯 Uso de la Aplicación

### 1. Dashboard Principal
- Visualiza estadísticas generales de facturación
- Accede a diferentes secciones desde el sidebar
- Monitorea métricas en tiempo real

### 2. Gestión de Facturas
- **Ver facturas**: Tabla con paginación y filtros
- **Crear factura**: Formulario con validación completa
- **Editar factura**: Modificar facturas existentes
- **Eliminar factura**: Confirmación antes de eliminar

### 3. Filtros y Búsqueda
- Búsqueda por número de factura o cliente
- Filtro por rango de fechas
- Filtro por estado (Pagada, Pendiente, Vencida)
- Filtros combinables para búsquedas específicas

### 4. Importación CSV
- Descarga plantilla CSV de ejemplo
- Carga archivo CSV con validación
- Vista previa de datos antes de importar
- Manejo de errores en datos inválidos

## 🔧 Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Linting y Formateo
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos TypeScript
\`\`\`

## 🎨 Personalización de Estilos

### Variables CSS Personalizadas
El proyecto utiliza variables CSS para mantener consistencia:

\`\`\`css
/* CoreUI Pro Color Palette */
--coreui-primary: #321fdb;
--coreui-secondary: #ced2d8;
--coreui-success: #2eb85c;
--coreui-info: #39f;
--coreui-warning: #f9b115;
--coreui-danger: #e55353;
\`\`\`

### Temas AG Grid
Configuración personalizada para AG Grid que mantiene consistencia con el diseño:

\`\`\`css
.ag-theme-alpine.ag-theme-coreui {
  --ag-background-color: #ffffff;
  --ag-foreground-color: #0f172a;
  --ag-border-color: #e2e8f0;
}
\`\`\`

## 📊 Estructura de Datos

### Interfaz Invoice
\`\`\`typescript
interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  description?: string;
}
\`\`\`

### Store Zustand
\`\`\`typescript
interface InvoiceStore {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  filters: InvoiceFilters;
  // ... acciones
}
\`\`\`

## 🧪 Validaciones Implementadas

### Esquema de Validación Yup
- **Número de factura**: Requerido, formato específico
- **Cliente**: Requerido, mínimo 2 caracteres
- **Monto**: Requerido, número positivo
- **Fechas**: Formato válido, fecha de vencimiento posterior a fecha de emisión
- **Estado**: Uno de los valores permitidos

## 🚀 Funcionalidades Avanzadas

### Filtrado Reactivo
- Los filtros se aplican automáticamente al cambiar
- Combinación de múltiples criterios de filtrado
- Búsqueda en tiempo real sin necesidad de botones

### Gestión de Estado Optimizada
- Store Zustand con acciones tipadas
- Actualizaciones reactivas de la UI
- Persistencia de filtros durante la sesión

### Importación CSV Robusta
- Validación de estructura de archivo
- Manejo de errores por fila
- Vista previa antes de confirmar
- Feedback detallado del proceso

## 🔒 Consideraciones de Seguridad

- Validación tanto en frontend como preparada para backend
- Sanitización de datos de entrada
- Manejo seguro de archivos CSV
- Tipado estricto con TypeScript

## 📈 Rendimiento

- Componentes optimizados con React
- Lazy loading de componentes pesados
- Paginación en tabla para grandes datasets
- Debounce en filtros de búsqueda

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Notas de Desarrollo

### Decisiones Técnicas
- **Zustand vs Redux**: Elegido por simplicidad y menor boilerplate
- **AG Grid vs TanStack Table**: AG Grid por funcionalidades empresariales avanzadas
- **Formik vs React Hook Form**: Formik por integración sencilla con Yup
- **shadcn/ui**: Sistema de componentes consistente y personalizable

### Próximas Mejoras
- [ ] Integración con API backend
- [ ] Autenticación y autorización
- [ ] Exportación a PDF
- [ ] Notificaciones push
- [ ] Modo offline con sincronización

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- Crear issue en el repositorio
- Contactar al equipo de desarrollo
- Revisar documentación de componentes

---

**Desarrollado para CustomsCity - Departamento de Contabilidad**  
*Frontend Developer Test - Módulo de Facturación*
