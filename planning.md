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
- [x] **Mover la lógica de `/dashboard` a un `DashboardController`** — Creado `App\Http\Controllers\business\DashboardController::index()`, con `ChecklistLifecycleService` y `DashboardStatsService` inyectados por constructor (mismo patrón que `DespensyController`/`CheckoutController`). `routes/web.php` pasó de un closure de 40+ líneas a `Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard')`. Lógica y payload de Inertia sin cambios, solo movidos — no se creó un Resource nuevo para los arrays de `topCategories`/`topPlaces`/`topProducts` (son estructuras ad-hoc para el dashboard, no una entidad con Resource propio).

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

- [x] **Componente ProductCard mejorado** — Obsoleto en el plan, resuelto distinto: no se creó un `ProductCard` dedicado; despensy usa `DataTable`/`DataCards` (genéricos, con `Column<T>`) sobre `despensyColumns`, que ya muestran último precio/última compra y tienen la acción "Ver / agregar a la lista" — cubre lo mismo sin un componente ad-hoc.
- [x] **Componente ChecklistItemCard** — Obsoleto en el plan, resuelto distinto: `CheckoutItemRow` (pendientes) y `BoughtItemRow` (confirmados) en `checkout/index.tsx` cubren exactamente este rol (checkbox/confirmar, cantidad/precio/lugar, optimizado para móvil), sin necesidad de un componente compartido único ya que pendientes y confirmados tienen forms/acciones distintas.

- [x] Historial de compras en `products/show.tsx` como lista de tarjetas (mismo patrón visual que `checklists/show.tsx` y "Comprados" en checkout) — no se creó un componente `PurchaseHistoryTable` ni paginación de cliente porque el historial de un solo producto no alcanza el volumen que justifique paginar (ver `docs/ARCHITECTURE.md`)
- [x] **Unificar el filtro de categoría + búsqueda (despensy y checkout)** — Se creó el hook `useCategoryFilter<T>(items, getCategoryId)` (`resources/js/hooks/use-category-filter.ts`), que encapsula el `useState` del filtro (`'all'` o el id como string) + el `useMemo` que filtra por categoría, y el componente `CategoryFilterSelect` (`resources/js/components/shared/categoryFilterSelect.component.tsx`) con el `<Select>` que antes estaba duplicado. Se aplicó en 3 lugares (era una duplicación triple, no solo doble): `despensy/index.tsx` (filtro de productos), y en `checkout/index.tsx` tanto en pendientes (`CheckoutIndex`) como en confirmados (`BoughtItemsList`). En cada caso el filtrado por categoría se compone con el resto de la lógica propia de esa vista (búsqueda por nombre, `listFilter`, `placeFilter`) encadenando sobre `filteredItems`/`facetedProducts` del hook, sin cambiar el comportamiento existente.
- [x] **Unificar las tarjetas "Top" del dashboard en un solo componente** — Creado `TopListCard<T extends { purchases_count: number }>` (`resources/js/components/shared/topListCard.component.tsx`): recibe `title`, `items`, `getKey` y `renderItem` (patrón genérico, igual que `Column<T>` en los `structure.tsx`), y resuelve el ícono `Trophy`, el ranking `#N` y el "`N` compra(s)" internamente ya que esa parte era 100% idéntica en las 3 cards. `dashboard.tsx` eliminó `TopCategoriesCard`/`TopPlacesCard`/`TopProductsCard` (unas ~90 líneas) y las reemplazó por 3 usos de `<TopListCard>`, cada uno pasando solo su `renderItem` específico (`ColorBadge` para categorías, `Badge` con color inline para lugares, texto plano para productos).

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
- [x] **Agregar tests que falten para lo último agregado** — No hay test que verifique que `/dashboard` devuelve `topCategories`/`topPlaces`/`topProducts`, ni que `/despensy/checkout` devuelve `categories`

### Mejoras Futuras (Backlog)

- [x] **Actualizar `docs/DOMAIN.md` y `docs/ARCHITECTURE.md`** — Ambos decían que el cálculo de "última compra" vivía inline en `ProductController::index` y que faltaba moverlo a un Service. Corregido el texto en ambos para reflejar que ya está extraído a `ProductLastPurchaseService`, reutilizado por `ProductController` y `DespensyController`.
- [ ] Estadísticas de gasto por categoría
- [ ] Gráficas de evolución de precios
- [ ] Comparativa de precios entre lugares
- [ ] Sugerencias basadas en frecuencia de compra
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

- [x] **Bug: selects de unidad/lugar no se pueden navegar** — `Combobox` (`resources/js/components/ui/combobox.tsx`) ganó navegación con flechas ↑/↓ + Enter/Escape sobre el input de búsqueda, con `scrollIntoView` automático del ítem resaltado. `PopoverContent` (`popover.tsx`) ganó una prop `container` porque el scroll-lock de Radix Dialog solo permite scroll con mouse/touch dentro del propio subárbol DOM del modal — un popover portado a `document.body` (default) quedaba sin scroll ahí. Se propagó como `portalContainer` en los combobox dentro de modales: `addOutOfListProductModal.tsx`, y en `checkout/index.tsx` (`EditBoughtItemModal` y el diálogo "¿Dónde compraste?").
    - **Regresión (intento 1, revertido):** `portalContainer={contentRef.current}` leía un `useRef` directamente como valor en el render — siempre `null` en el primer render tras montar el `DialogContent` (React recién asigna el ref en el commit) — por eso el scroll con rueda seguía fallando de forma intermitente. Se cambió a `useState<HTMLDivElement | null>` + `ref={setContentEl}`, correcto, pero portar el popover _dentro_ del modal reveló un problema nuevo: el `DialogContent` tiene `overflow-y-auto` + un `transform` (para centrarlo), lo que recorta el dropdown ahí dentro y el modal entero aparecía con scrollbar propia y muy chico.
    - **Intento 2 (revertido):** se probó `modal={false}` en el `<Dialog>` para desactivar el scroll-lock de Radix y poder dejar el popover portado a `document.body` sin necesidad de meterlo dentro del modal. Efecto secundario inaceptable: en Radix, `Dialog.Overlay` internamente hace `return context.modal ? <Overlay/> : null` — con `modal={false}` el backdrop oscuro detrás del modal desaparece por completo (no es un tema de CSS/z-index, Radix directamente no lo renderiza).
    - **Fix final:** se mantiene `modal` en su valor por defecto (`true`, con backdrop) y se vuelve a portar el popover dentro del modal (`useState<HTMLDivElement | null>` + `ref={setContentEl}` + `portalContainer={contentEl}`, en los 3 archivos: `productDespensaModal.tsx`, `addOutOfListProductModal.tsx`, `checkout/index.tsx`), pero además se le agrega `overflow-visible` al `className` de cada `DialogContent` afectado (`sm:max-w-md` → `overflow-visible sm:max-w-md`) para que ya no recorte el dropdown portado adentro. Como estos modales son formularios cortos que no necesitan scroll interno propio, quitarles el `overflow-y-auto` no tiene efecto negativo.

- [x] **Búsqueda de productos sin distinguir tildes (CRUD productos, despensy/checkout, despensy/)** — Se agregó `normalizeText()` (`resources/js/lib/utils.ts`): `toLowerCase()` + `normalize('NFD')` + strip de marcas diacríticas combinantes (`̀`-`ͯ`), en ambas direcciones (normaliza tanto el término buscado como el valor comparado). Se aplicó en `useClientPagination` (cubre products, categories, places, units, checklists y despensy, que ya pasan por ese hook), en el filtro inline de productos pendientes en `checkout/index.tsx`, y en el filtro del propio `Combobox` (`resources/js/components/ui/combobox.tsx`) — así que también se buscan sin tildes las unidades/lugares/productos dentro de cualquier select con búsqueda.

- [x] **Mejorar el responsive de despensy/checkout** — Causa raíz: dos layouts distintos apretaban el nombre del producto contra un elemento `shrink-0` (badge de categoría) o una tabla de 5 columnas en el rango táctil (768–1024px, tablets):
    - `despensy/index.tsx`: el wrapper de `DataTable`/`DataCards` usaba el breakpoint `md` (768px), pero `DataCards` está diseñado internamente para el breakpoint `lg` (`sm:grid-cols-2 lg:hidden`) — ese desajuste hacía que la tabla de 5 columnas (nombre, categoría, última compra, estado, acciones) se mostrara ya desde 768px, sin espacio para el nombre. Se alinearon los wrappers a `hidden lg:block` / `block lg:hidden`, así las cards (2 columnas, más espacio) se usan hasta 1024px.
    - `checkout/index.tsx` (`CheckoutItemRow` y `BoughtItemRow`): el layout pasaba de columna a fila desde `sm` (640px), y dentro de la fila el nombre (`flex-1 min-w-0 truncate`) competía por espacio con el badge de categoría (`shrink-0`) y el resto de campos/botones — en tablet el nombre quedaba con casi cero ancho. Se subió el breakpoint de fila de `sm:` a `lg:` en ambos componentes, así por debajo de 1024px todo queda apilado en columna (nombre en su propia línea a ancho completo, siempre legible) y solo a partir de 1024px pasa a fila horizontal.

- [x] **No manejar decimales en precios (nivel visual)** — `Money`/`formatCurrency` (`resources/js/lib/utils.ts`) ya truncaban a entero al mostrar (`Math.trunc`), así que el problema real estaba en la **entrada**: los inputs de "Precio total" tenían `step="0.01"`. Cambiado a `step="1"` en los tres inputs de precio (`checkout/index.tsx` — `CheckoutItemRow` y `EditBoughtItemModal` —, y `addOutOfListProductModal.tsx`). No se tocó la base de datos/migraciones (`total_price`/`unit_price` siguen `decimal:2`); se agregó el mínimo de backend necesario como defensa adicional: la regla de `total_price` pasó de `numeric` a `integer` en `ChecklistItemMarkBoughtRequest` y `CheckoutAddProductRequest`.

- [x] **Bug: `ColorBadge` de lugar sin colores en despensy** — `DespensyController::index` traía `places` con `Place::where('enabled', true)->get(['id', 'name'])`, sin `bg_color`/`text_color`, por lo que el `ColorBadge` del lugar en `MarkBoughtSection` se renderizaba sin color. Corregido el `select` a `['id', 'name', 'bg_color', 'text_color']`.

- [x] **Bug: suma incorrecta en "Productos Confirmados" (checkout)** — `ChecklistItem::$casts` tiene `'total_price' => 'decimal:2'`, y Laravel serializa los `decimal` casts como **string** (ej. `"12.50"`), aunque el tipo TS (`ChecklistItem.total_price: number | null`) diga lo contrario. Sumar strings con `+`/`+=` hace concatenación, no suma numérica (`"12.50" + "8.00" = "12.508.00"`). Corregido envolviendo cada valor en `Number(...)` antes de sumar, en los tres lugares donde se acumulaba `total_price`: `checkout/index.tsx` (total de confirmados), `placeSummaryCard.tsx` (total por lugar) y `checklists/show.tsx` (total del historial). `Money`/`formatCurrency` ya manejaban el string correctamente (por eso el precio individual de cada item se veía bien) — el bug solo afectaba a las sumas acumuladas.

- [x] **UI: "Pendientes"/"Productos Confirmados" en checkout usan el mismo estilo que `DataTable`** — Se decidió no estandarizar despensy y checkout en un mismo componente (`DataTable` es para listados de solo-lectura; checkout aloja formularios en línea por fila, que no encajan bien en celdas de tabla), pero sí unificar el estilo visual. Se probó primero mover el `px-6` del `Card` (`resources/js/components/ui/card.tsx`) desde `CardHeader`/`CardContent`/`CardFooter` hacia el `Card` base — se revirtió. Solución final: en `checkout/index.tsx`, los wrappers de "Pendientes" y `BoughtItemsList` dejaron de usar `<Card>`/`<CardContent>` y pasaron a un `div` con las mismas clases que el wrapper de `DataTable` (`rounded-xl border border-sidebar-border/70 dark:border-sidebar-border`, sin `shadow-sm` ni header), y las filas (`CheckoutItemRow`/`BoughtItemRow`) ganaron `hover:bg-muted/50 transition-colors` igual que `TableRow`.

---

## Nuevas tareas

- Use this format to add new tasks

---

## Actualizado

- 2026-08-05
