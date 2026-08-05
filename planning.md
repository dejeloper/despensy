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
- [x] **Bug: Despensa muestra productos desactivados** — `ProductLastPurchaseService::allWithLastPurchase()` no filtraba por `enabled = true`, entonces un producto que desactivás seguía apareciendo en la vista de compra y se podía seguir agregando a la lista. Es un método compartido con `ProductController::index` (CRUD de productos), que sí necesita ver los desactivados para poder reactivarlos, así que no se podía filtrar en el service directamente. Se agregó el parámetro opcional `onlyEnabled` (default `false`) — `DespensyController::index` lo pasa en `true`, el CRUD lo deja en `false`.
- [ ] **Mover la lógica de `/dashboard` a un `DashboardController`** — Hoy es un closure en `routes/web.php` que ya orquesta 2 Services (`ChecklistLifecycleService` y `DashboardStatsService`) — es la única vista de negocio que no sigue el patrón Controller del resto de la app

### Frontend - Vistas

- [x] Vista index para Categories (con búsqueda global y paginación del cliente)
- [x] Vista index para Places (con búsqueda global y paginación del cliente)
- [x] Vista index para Units (con búsqueda global y paginación del cliente)
- [x] Vista index para Products (con búsqueda global y paginación del cliente)
- [x] Componente reutilizable `SearchBar`
- [x] Hook personalizado `useClientPagination` para búsqueda y paginación
- [x] Componentes `DataTable` y `DataCards` para visualización responsive

### Modelos Eloquent (Alta Prioridad)

- [x] Eliminar campos `price` y `stock` de la tabla `products` - YA NO NECESARIO (la migración no los tiene)
- [x] **CORREGIR modelo Product.php** - Eliminar price y stock del $fillable y $casts (la migración no los tiene)
- [x] **Crear modelo State.php** con relaciones
- [x] **Crear modelo Checklist.php** con relaciones (State, Items, User)
- [x] **Crear modelo ChecklistItem.php** con todas las relaciones (Producto, unidad planeada, unidad comprada, lugar)

### Lógica de Negocio (Alta Prioridad)

- [x] **Helper o Service para obtener última compra de un producto**
    - Último precio pagado
    - Última fecha de compra
    - Último lugar de compra
    - Reutilizable en controladores y vistas

- [x] **Regla de negocio: Solo una lista abierta por usuario**
    - Validación en ChecklistController
    - Middleware o método que cierre lista anterior al crear nueva
    - Tests para verificar la regla

- [x] **Normalizar estados de checklist**
    - Usar solo: open, in_progress, closed, cancelled
    - Eliminar cualquier referencia a estados hardcoded como strings
    - Centralizar lógica de cambio de estados

### Vista Principal de Productos (CRÍTICA - Máxima Prioridad)

- [x] **Rediseñar vista de productos como "Despensa"**
    - Mostrar último precio (desde última compra)
    - Mostrar última fecha de compra
    - Mostrar último lugar de compra
    - Indicador visual si está en lista activa o no
- [x] **Filtros en vista de productos**
    - Filtro por categoría
    - Filtro por estado (en lista / fuera de lista)
    - Mantener búsqueda global existente

- [x] **Acción rápida: Agregar a lista activa**
    - Botón "+/−" en cada producto
    - Si no hay lista abierta, crearla automáticamente
    - Feedback visual inmediato
    - Funcionar desde el listado sin modal

- [x] **Acción rápida: Quitar de lista activa**
    - Mismo botón "+/−" (toggle)
    - Actualización inmediata
    - Confirmación opcional solo si ya tiene datos de compra

### Vista de Lista de Compra Activa (Alta Prioridad)

- [x] **Nueva vista: /checklists/active**
    - Diseño optimizado para móvil
    - Lista de productos agregados
    - Checkbox para marcar como comprado
    - Campos rápidos: cantidad, precio, lugar
- [x] **Flujo de marcar producto como comprado**
    - Registrar precio pagado
    - Registrar cantidad comprada
    - Registrar lugar de compra
    - Registrar fecha de compra
    - Actualizar estado del item en la lista

- [x] **Acción: Cerrar lista**
    - Cambiar estado a "closed"
    - Validar que no se pueda modificar después
    - Redirigir a resumen o a crear nueva lista

- [x] **Acción: Cancelar lista**
    - Cambiar estado a "cancelled"
    - No registrar compras
    - Permitir crear nueva lista

### Vista de Detalle de Producto (Prioridad Media)

- [x] **Nueva vista: /products/{id}**
    - Información básica del producto
    - Último precio, fecha y lugar
    - Historial de compras (tabla simple)
    - [ ] Gráfica opcional de evolución de precio (pendiente, no crítica)

- [x] **Sección de historial**
    - Listar compras anteriores
    - Fecha, precio, cantidad, lugar
    - Ordenado por fecha descendente

### Backend - Controllers Checklist (Alta Prioridad)

- [x] **Crear ChecklistController**
    - index() - Ver listas del usuario
    - active() - Ver lista activa
    - store() - Crear nueva lista (cerrar anterior)
    - complete(id) - Cerrar lista
    - cancel(id) - Cancelar lista

- [x] **Crear ChecklistItemController**
    - addProduct(checklist_id, product_id) - Agregar producto a lista
    - removeProduct(checklist_id, product_id) - Quitar producto
    - markAsBought(item_id) - Marcar como comprado con datos
    - update(item_id) - Actualizar datos del item

- [x] Actualizar ProductController - Ya tiene CRUD completo
- [x] Agregar método show(id) para detalle
- [x] lastPurchase/purchaseHistory se resuelven en un único `ProductLastPurchaseService::purchaseHistoryFor()`, reutilizado por `show()` — no se crearon endpoints separados, consistente con que esta app no expone una API REST aparte del renderizado de páginas Inertia

### Frontend - Componentes (Alta Prioridad)

- [ ] **Componente ProductCard mejorado**
    - Mostrar último precio
    - Mostrar última compra
    - Botón toggle para agregar/quitar de lista
    - Indicador visual de estado

- [ ] **Componente ChecklistItemCard**
    - Para usar en vista de compra
    - Checkbox de comprado
    - Campos de precio, cantidad, lugar
    - Optimizado para móvil

- [x] Historial de compras en `products/show.tsx` como lista de tarjetas (mismo patrón visual que `checklists/show.tsx` y "Comprados" en checkout) — no se creó un componente `PurchaseHistoryTable` ni paginación de cliente porque el historial de un solo producto no alcanza el volumen que justifique paginar (ver `docs/ARCHITECTURE.md`)
- [ ] **Unificar el filtro de categoría + búsqueda (despensy y checkout)** — `despensy/index.tsx` y `checkout/index.tsx` repiten casi el mismo `useState` + `useMemo` + `<Select>` de categorías. Extraerlo a un hook (`useCategoryFilter`) o componente compartido
- [ ] **Unificar las tarjetas "Top" del dashboard en un solo componente** — `TopCategoriesCard`, `TopPlacesCard` y `TopProductsCard` son casi idénticas (ícono + título + lista con badge y contador). Se pueden fusionar en un componente genérico con un `renderItem`, como ya se hace con `Column<T>` en los `structure.tsx`

### Tipos TypeScript (Prioridad Media)

- [x] Crear tipo `State`
- [x] Crear tipo `Checklist` con relaciones
- [x] Crear tipo `ChecklistItem` con relaciones
- [x] Actualizar tipo `Product` (quitar price y stock)
- [x] No se creó un tipo `PurchaseHistory` — el historial se tipa como `ChecklistItem[]` (ya existente), que refleja exactamente lo que devuelve `ChecklistItemResource`

### Rutas (Alta Prioridad)

- [x] Definir rutas para checklists
    - GET /dashboard/checklists - Listar
    - GET /dashboard/checklists/active - Ver activa
    - POST /dashboard/checklists - Crear
    - POST /dashboard/checklists/{id}/complete - Completar
    - POST /dashboard/checklists/{id}/cancel - Cancelar

- [x] Definir rutas para items
    - POST /dashboard/checklists/{id}/items - Agregar producto
    - DELETE /dashboard/checklists/{id}/items/{product_id} - Quitar
    - PATCH /dashboard/checklist-items/{id}/mark-bought - Marcar comprado

- [x] Ruta para detalle de producto - `Route::resource('products', ...)` ya no excluye `show`

### Navegación y UX (Prioridad Media)

- [x] Actualizar menú principal
    - Despensa (productos)
    - Mi Lista (lista activa)
    - Historial (listas anteriores)

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
- [ ] **Agregar tests que falten para lo último agregado** — No hay test que verifique que `/dashboard` devuelve `topCategories`/`topPlaces`/`topProducts`, ni que `/despensy/checkout` devuelve `categories`

### Mejoras Futuras (Backlog)

- [ ] **Actualizar `docs/DOMAIN.md` y `docs/ARCHITECTURE.md`** — Ambos todavía dicen que el cálculo de "última compra" vive inline en `ProductController::index` y que falta moverlo a un Service — pero eso ya se hizo (`ProductLastPurchaseService`). Solo hay que corregir el texto
- [ ] Estadísticas de gasto por categoría
- [ ] Gráficas de evolución de precios
- [ ] Comparativa de precios entre lugares
- [ ] Sugerencias basadas en frecuencia de compra
- [ ] Exportar historial a Excel/PDF
- [ ] Notificaciones de productos no comprados en X tiempo

---

## Issues en producción

- [x] **Quitar el ofrecimiento de traducción de Chrome** — Causa raíz: `APP_LOCALE=en` hacía que `<html lang="en">` no coincidiera con el contenido real (español), lo que dispara el aviso de traducción en cualquier navegador (Chrome, Safari, etc). Corregido `APP_LOCALE`/`APP_FALLBACK_LOCALE` a `es` en `.env`, `.env.example`, `.env.prod` y el default de `config/app.php`; agregado `translate="no"` + `<meta name="google" content="notranslate">` en `app.blade.php` como refuerzo para Chrome/Edge.

- [x] **Orden alfabético por defecto en todos los listados del sistema** — Se generalizó a un helper `sortBy<T>(items, key, direction?)` (`resources/js/lib/utils.ts`), que acepta el nombre de columna (`keyof T`) o un accessor para valores anidados, con colación española (`localeCompare('es')`) para strings y orden numérico para números. Se integró como parámetro opcional `sortKey` en `useClientPagination` y se aplicó (`sortKey: 'name'`) en categories, places, units, checklists, products y despensy; `checkout/index.tsx` y `AddOutOfListProductModal` usan `sortBy` directamente al no pasar por el hook. El listado de "Comprados" en checkout se dejó ordenado por fecha (más reciente primero) por ser un historial, no un catálogo.

- [x] **Editar/desconfirmar un producto ya confirmado en una lista** — El backend ya tenía todo lo necesario (`ChecklistItemService::markAsBought/markAsNotBought` + rutas `checklist-items.mark-bought`/`mark-not-bought`), incluida la regla de "solo si el checklist está abierto/en progreso" (`guardEditable` lanza `ChecklistNotEditableException` si está cerrado/cancelado). Faltaba exponerlo en la UI:
    - `checkout/index.tsx`: la sección "Comprados" tiene, por item, un botón **Editar** (ícono lápiz, `variant="outline"` para que se vea como botón) que abre un **modal** (`EditBoughtItemModal`) con cantidad, unidad, lugar y precio; el modal tiene **Guardar** (reutiliza `mark-bought`) y **Quitar confirmación** (`mark-not-bought`, con `confirm()`) juntos en el footer.
    - `despensy/` (`ProductDespensaModal` → `MarkBoughtSection`): decisión final distinta a checkout — cuando el item ya está comprado, **no** se puede reeditar/reconfirmar desde este modal, solo **deshacer**. La sección muestra un resumen compacto de solo lectura (cantidad + unidad, `ColorBadge` del lugar con sus colores, y precio total con `Money`) más un botón **Deshacer** (con spinner `LoaderCircle` mientras la petición a `mark-not-bought` está en curso). Se agregó `active_total_price` al backend (`ProductLastPurchaseService`, `ProductResource`) y al tipo `Product` para poder mostrar el precio. `DespensyController::index` amplió el `select` de `places` a `['id', 'name', 'bg_color', 'text_color']` (antes solo traía `id`/`name`, por lo que el `ColorBadge` no tenía colores).
    - Decisión explícita: cantidad sigue siendo entera en todo el sistema (no se hizo la migración a `decimal` para `quantity_bought`/`quantity_planned`/`quantity_at_home`).

- [x] **Filtro por lugar y categoría para confirmados (despensy/checkout)** — `BoughtItemsList` (dentro de `checkout/index.tsx`) tiene su propio `placeFilter`/`categoryFilter`, con estado 100% independiente del filtro de categoría de "pendientes" (cada uno vive en su propio componente, sin compartir estado). Filtra tanto las filas de "Productos Confirmados" como el `PlaceSummaryCard` (el resumen refleja lo filtrado). Muestra mensaje "Ningún producto confirmado coincide con el filtro" cuando no hay resultados.

- [x] **Resumen por lugar en despensy/checkout** — Componente `PlaceSummaryCard` (`resources/js/components/business/checkout/placeSummaryCard.tsx`), calculado 100% en el cliente (`useMemo`, sin cambios de backend): agrupa por `item.place`, contando productos y sumando `total_price`, ignorando items sin lugar o sin precio (pendientes no entran porque no tienen `total_price`). Vive dentro de `BoughtItemsList`, debajo de los selects de lugar/categoría y antes de la lista de items — recibe los items ya filtrados, así que al filtrar por lugar el resumen solo muestra ese lugar. Cada fila: `ColorBadge` del lugar + "Productos: N · Total: $y" (N y el total en negrita). El título de la sección volvió a ser "Productos Confirmados (x)" con el contador. De paso se corrigieron los `SelectTrigger` de categoría/lugar (checkout y despensy) de ancho fijo a `w-auto whitespace-nowrap`, porque "Todas las categorías" se partía en dos líneas.

- [ ] **Bug: selects de unidad/lugar no se pueden navegar** — En el modal "Producto fuera de la lista" de checkout, los selects de unidad y lugar (los que permiten escribir):
    - Desktop: el scroll con la ruedita del mouse no funciona dentro del dropdown; hay que usar el botón "bajar".
    - Teclado: para saltar a una opción hay que escribir la palabra completa (ej. escribir "p" no filtra ni permite bajar con flechas hasta la última opción).
    - iPad: el scroll táctil dentro del dropdown no funciona.
    - Hay que identificar el componente de select usado y corregir su navegación por teclado/scroll.

- [ ] **Búsqueda de productos sin distinguir tildes (CRUD productos, despensy/checkout, despensy/)** — Normalizar acentos **en el cliente**, en la misma lógica de búsqueda actual (client-side, ya trae todo el listado), en ambas direcciones: buscar "cafe" encuentra "café" y buscar "café" encuentra "cafe".

- [ ] **Mejorar el responsive de despensy/checkout** — En resoluciones menores a 1024px el nombre del producto no se ve; ajustar el layout para que el nombre sea legible en pantallas pequeñas.

- [ ] **No manejar decimales en precios (nivel visual)** — Trabajar precios como números enteros (redondeo/sin decimales) en toda la UI. **No tocar** base de datos ni migraciones; mover el mínimo de backend si es estrictamente necesario (ej. formateo).

- [x] **Bug: `ColorBadge` de lugar sin colores en despensy** — `DespensyController::index` traía `places` con `Place::where('enabled', true)->get(['id', 'name'])`, sin `bg_color`/`text_color`, por lo que el `ColorBadge` del lugar en `MarkBoughtSection` se renderizaba sin color. Corregido el `select` a `['id', 'name', 'bg_color', 'text_color']`.

---

## Nuevas tareas

- Use this format to add new tasks

---

## Actualizado

- 2026-08-05
