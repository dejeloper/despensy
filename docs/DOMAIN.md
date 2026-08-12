# Dominio de Despensy

Este documento describe las entidades del negocio y sus reglas correctas del dominio — no documenta bugs a propósito. Si en algún momento el código se desvía de esto (por ejemplo, un campo que referencia una columna que ya no existe), es una inconsistencia a corregir, no una variante válida de este modelo.

## Entidades

### Product

Un producto de despensa. **No tiene precio ni stock propios** — esos datos son históricos y viven en `ChecklistItem`. El producto es catálogo, no inventario.

Columnas reales (`database/migrations/2025_08_24_235228_create_products_table.php`): `name` (único, máx. 50), `description`, `image`, `category_id`, `enabled`.

Relaciones: pertenece a una `Category`. La relación con `Place` y `Unit` en el listado (`last_place_name`, `last_unit_name`, `last_price`) **no es una relación directa del producto** — se deriva del último `ChecklistItem` con `was_bought = true` para ese producto. Un producto no tiene "su" lugar ni "su" unidad fijos; tiene el lugar/unidad de su última compra.

### Category

Clasificación de productos, con color e ícono para la UI (`bg_color`, `text_color`, `icon`). Un producto pertenece exactamente a una categoría.

### Place

Lugar de compra (ej. "Supermercado X"). No pertenece al producto — se asocia por cada compra individual a través de `ChecklistItem.place_id`.

### Unit

Unidad de medida (ej. "kg", "unidad"), con `short_name` para mostrar compacto. Se usa en dos momentos distintos de un `ChecklistItem`: la unidad planeada (`unit_id_planned`) y la unidad con la que efectivamente se compró (`unit_id_bought`) — pueden diferir.

### State

Catálogo centralizado de estados (tabla `states`, con `name`, `type`, `color`, `icon`, `enabled`). Los estados de `Checklist` **nunca se hardcodean como string** (`'open'`, `'closed'`) directamente en el código de negocio; se referencian por `state_id` contra este catálogo. `type` permite que la misma tabla sirva para catalogar estados de distintas entidades en el futuro sin crear una tabla de estados por entidad.

Estados válidos para `Checklist` (según `planning.md`): `open`, `in_progress`, `closed`, `cancelled`.

### Checklist

Una lista de compra **compartida por todos los usuarios autenticados** — no pertenece a un usuario en el sentido de control de acceso. Tiene un `state_id`, un `name` opcional y un `user_id` que registra quién la creó, puramente informativo (se muestra como "creado por" en la UI, no restringe quién puede verla o editarla).

**Regla de negocio central: solo puede existir una checklist en estado `open` (o `in_progress`) a la vez en todo el sistema**, sin importar quién la creó. Al crear una nueva lista mientras existe una abierta, la anterior debe cerrarse o cancelarse primero — esta regla vive en un Service (`ChecklistLifecycleService`, ver `docs/ARCHITECTURE.md`), nunca duplicada en el controlador o en el frontend.

Ciclo de vida: `open` → (`in_progress` opcional mientras se compra) → `closed` (compra completada, inmutable después) o `cancelled` (se descarta, no genera historial de compra).

### ChecklistItem

Un producto dentro de una checklist, con tres "capas" de datos: lo que ya hay en casa, lo planeado y lo comprado.

- En casa: `quantity_at_home`, `unit_id_at_home` — cuánto queda en la despensa al armar la lista. Es informativo (ayuda a decidir cuánto comprar), no participa en ningún cálculo de precio.
- Planeado: `quantity_planned`, `unit_id_planned`.
- Comprado (se llenan al marcar `was_bought = true`): `quantity_bought`, `unit_id_bought`, `place_id`, `unit_price`, `total_price`, `purchase_date`.

Las tres cantidades son **fraccionarias** — se compra por peso ("1,64 kg de carne"), no solo por unidades enteras. La precisión y el casteo están en `docs/DATABASE.md`; la entrada en la UI, en `docs/FRONTEND_CONVENTIONS.md`.

Este es el registro que alimenta el historial de compras de un producto. "Última compra de un producto" = el `ChecklistItem` más reciente de ese producto con `was_bought = true`, ordenado por `purchase_date` (o `created_at` si `purchase_date` es nulo) — lógica centralizada en `ProductLastPurchaseService` (ver `docs/ARCHITECTURE.md`), reutilizada por `ProductController` y `DespensyController`.

`product_id` usa `onDelete('restrict')`: no se puede borrar un producto que tiene historial de compras. Es una decisión deliberada — perder el historial de precios de un producto sería perder el propósito principal de la app.

## Reglas de negocio que deben quedar centralizadas (no duplicadas)

1. **Una sola checklist abierta en todo el sistema** (compartida por todos los usuarios) — lógica en un único Service, nunca replicada en controlador ni en validación de frontend únicamente.
2. **Última compra de un producto** (precio, lugar, fecha, unidad) — un único método/Service reutilizable, no una subquery repetida en cada controlador que la necesite.
3. **Transiciones de estado de checklist** — `open → in_progress → closed` y `* → cancelled` son las únicas transiciones válidas. Una checklist `closed` o `cancelled` es inmutable: ningún endpoint debe permitir modificar sus `ChecklistItem` después de ese punto.
4. **Estados como catálogo, no como string mágico** — cualquier comparación de estado se hace contra `State` (por `id` o por un valor conocido consultado una sola vez), nunca comparando strings hardcodeados esparcidos en el código.
