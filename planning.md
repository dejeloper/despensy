# Plan de Trabajo - Despensy

Herramienta personal para tomar mejores decisiones al momento de comprar productos de despensa.

---

## Plan

### Base de Datos

- [x] Tabla `products` (nombre, descripción, imagen, categoría, estado) - SIN price ni stock
- [x] Tabla `categories` (con colores e iconos)
- [x] Tabla `places` (lugares de compra con colores)
- [x] Tabla `units` (unidades de medida)
- [x] Tabla `checklists` (listas de compra vinculadas a usuarios con state_id)
- [x] Tabla `checklist_items` (items de cada lista con precios, cantidades, lugares)
- [x] Tabla `states` (estados centralizados)

### Seeders

- [x] Datos de prueba para categories, places, units
- [x] Datos de prueba para productos
- [x] Seeder de estados
- [x] Seeder de checklist con items de ejemplo

### Backend - Controladores

- [x] CRUD completo para Categories
- [x] CRUD completo para Places
- [x] CRUD completo para Units
- [x] CRUD completo para Products (sin métodos show, lastPurchase, purchaseHistory)
- [x] Todos los controladores traen todos los datos (preparados para búsqueda/paginación del cliente)
- [x] **Bug: Despensa muestra productos desactivados**
- [x] **Mover la lógica de `/dashboard` a un `DashboardController`**

### Frontend - Vistas

- [x] Vista index para Categories (con búsqueda global y paginación del cliente)
- [x] Vista index para Places (con búsqueda global y paginación del cliente)
- [x] Vista index para Units (con búsqueda global y paginación del cliente)
- [x] Vista index para Products (con búsqueda global y paginación del cliente)
- [x] Componente reutilizable `SearchBar`
- [x] Hook personalizado `useClientPagination` para búsqueda y paginación
- [x] Componentes `DataTable` y `DataCards` para visualización responsive

### Modelos Eloquent (Alta Prioridad)

- [x] Eliminar campos `price` y `stock` de la tabla `products`
- [x] **CORREGIR modelo Product.php**
- [x] **Crear modelo State.php** con relaciones
- [x] **Crear modelo Checklist.php** con relaciones (State, Items, User)
- [x] **Crear modelo ChecklistItem.php** con todas las relaciones (Producto, unidad planeada, unidad comprada, lugar)

### Lógica de Negocio (Alta Prioridad)

- [x] **Helper o Service para obtener última compra de un producto**
- [x] **Regla de negocio: Solo una lista abierta por usuario**
- [x] **Normalizar estados de checklist**

### Vista Principal de Productos (CRÍTICA - Máxima Prioridad)

- [x] **Rediseñar vista de productos como "Despensa"**
- [x] **Filtros en vista de productos**
- [x] **Acción rápida: Agregar a lista activa**
- [x] **Acción rápida: Quitar de lista activa**

### Vista de Lista de Compra Activa (Alta Prioridad)

- [x] **Nueva vista: /checklists/active**
- [x] **Flujo de marcar producto como comprado**
- [x] **Acción: Cerrar lista**
- [x] **Acción: Cancelar lista**

### Vista de Detalle de Producto (Prioridad Media)

- [x] **Nueva vista: /products/{id}**
- [ ] Gráfica opcional de evolución de precio (pendiente, no crítica)
- [x] **Sección de historial**

### Backend - Controllers Checklist (Alta Prioridad)

- [x] **Crear ChecklistController**
- [x] **Crear ChecklistItemController**
- [x] Actualizar ProductController
- [x] Agregar método show(id) para detalle
- [x] lastPurchase/purchaseHistory se resuelven en un único `ProductLastPurchaseService::purchaseHistoryFor()`, reutilizado por `show()`

### Frontend - Componentes (Alta Prioridad)

- [x] **Componente ProductCard mejorado**
- [x] **Componente ChecklistItemCard**
- [x] Historial de compras en `products/show.tsx` como lista de tarjetas
- [x] **Unificar el filtro de categoría + búsqueda (despensy y checkout)**
- [x] **Unificar las tarjetas "Top" del dashboard en un solo componente**

### Tipos TypeScript (Prioridad Media)

- [x] Crear tipo `State`
- [x] Crear tipo `Checklist` con relaciones
- [x] Crear tipo `ChecklistItem` con relaciones
- [x] Actualizar tipo `Product` (quitar price y stock)
- [x] No se creó un tipo `PurchaseHistory`

### Rutas (Alta Prioridad)

- [x] Definir rutas para checklists
- [x] Definir rutas para items
- [x] Ruta para detalle de producto

### Navegación y UX (Prioridad Media)

- [x] Actualizar menú principal
- [x] Badge en menú "Mi Lista" con contador de items
- [x] Breadcrumbs actualizados en todas las vistas
- [x] Mensajes de éxito/error con toasts
- [x] Sistema de notificaciones toast estandarizado (5 tipos: success, error, warning, info, neutral) sin dependencias externas

### Validaciones (Prioridad Media)

- [x] Validar que no se pueda crear lista si ya hay una abierta
- [x] Validar que no se pueda modificar lista cerrada/cancelada
- [x] Validar que precio sea numérico positivo
- [x] Validar que cantidad sea numérica positiva

### Tests (Prioridad Baja - Futuro)

- [x] Tests unitarios para lógica de última compra
- [x] Tests de integración para flujo de checklist
- [x] Tests de regla "solo una lista abierta"
- [x] **Agregar tests que falten para lo último agregado**

### Cantidades Fraccionarias (Alta Prioridad)

- [x] **Cantidades fraccionarias (`1,64 kg`)**

### Módulo de Equivalencias (Alta Prioridad)

- [x] **Módulo de equivalencias: unidades + contenedores por producto/lugar**

#### Pendiente de definir

- **Persistir la cantidad/precio normalizados** en `checklist_items` — Hoy se calculan al vuelo. Si los reportes históricos lo terminan necesitando por rendimiento, evaluar columnas `quantity_base`/`unit_price_base`, teniendo en cuenta que congelan el dato frente a una corrección posterior del factor.
- **Conversión a volumen (ml/L) y longitud** — El módulo de equivalencias arranca solo con peso.
- **Mostrar todas las equivalencias hermanas** ("1,64 kg = 1640 g = 3,28 lb") — Por ahora solo la unidad mínima.
- **Comparar precios entre lugares normalizando a la unidad base** — El uso más valioso a futuro (ej. "el kilo de arroz sale a $3.200 en Alkosto y $3.500 en Éxito"), pero implica tocar dashboard e histórico.

### Mejoras Futuras (Backlog)

- [x] **Actualizar `docs/DOMAIN.md` y `docs/ARCHITECTURE.md`**
- [ ] Estadísticas de gasto por categoría
- [ ] Gráficas de evolución de precios
- [ ] Comparativa de precios entre lugares
- [ ] Sugerencias basadas en frecuencia de compra
- [ ] Notificaciones de productos no comprados en X tiempo

---

## Issues en producción

- [x] **Quitar el ofrecimiento de traducción de Chrome**
- [x] **Orden alfabético por defecto en todos los listados del sistema**
- [x] **Editar/desconfirmar un producto ya confirmado en una lista**
- [x] **Filtro por lugar y categoría para confirmados (despensy/checkout)**
- [x] **Resumen por lugar en despensy/checkout**
- [x] **Bug: selects de unidad/lugar no se pueden navegar**
- [x] **Búsqueda de productos sin distinguir tildes (CRUD productos, despensy/checkout, despensy/)**
- [x] **Mejorar el responsive de despensy/checkout**
- [x] **No manejar decimales en precios (nivel visual)**
- [x] **Bug: `ColorBadge` de lugar sin colores en despensy**
- [x] **Bug: suma incorrecta en "Productos Confirmados" (checkout)**
- [x] **UI: "Pendientes"/"Productos Confirmados" en checkout usan el mismo estilo que `DataTable`**

---

## Nuevas tareas

- Use this format to add new tasks

---

## Actualizado

- 2026-08-13
