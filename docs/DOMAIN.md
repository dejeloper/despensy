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

`units` es **solo el catálogo**: nombre, nombre corto y `enabled`. Las equivalencias viven aparte (ver abajo).

### UnitEquivalence

Equivalencia dimensional **universal**: `1 unit = factor parent`, sin importar producto ni lugar (`1 Kilogramo = 1000 Gramo`). Se encadenan: Arroba → Libra → Gramo. Se registra contra la unidad con la que un humano la compara de verdad ("una arroba son 25 libras"), no contra la raíz — el recorrido hasta la unidad base lo hace `UnitConversionService`.

Una unidad se define contra **un solo** padre (índice único en `unit_id`): dos filas para Kilogramo harían ambigua la cadena.

### ProductContainer

Cuánto trae un empaque de un producto **concreto**, opcionalmente según el lugar: "1 Paquete de Leche en el Mercado A trae 6 Unidad", pero 8 en el Mercado B. Por eso no puede vivir en `unit_equivalences`: un paquete de leche y uno de arroz no traen lo mismo.

`place_id` nulo es la fila por defecto del producto, usada cuando el lugar de la compra no tiene la suya. Sin eso habría que repetir "la unidad de leche son 1300 ml" en cada uno de los lugares.

### Cómo se combinan

`UnitConversionService` recorre la cadena saltando entre las dos tablas. En cada salto gana la regla **más específica**: contenedor del producto en ese lugar → contenedor del producto sin lugar → equivalencia dimensional. Así "1 Paquete de Leche en Mercado A" resuelve a 6 Unidad y, si además existe "1 Unidad de Leche = 1300 Mililitro", sigue hasta 7800 ml.

Lo único que se muestra es el **precio por unidad mínima** ("$1,49/g"). La cantidad convertida (1,64 Kg → 1640 g) se calcula para poder dividir, pero **no se expone ni se muestra**: es un paso intermedio, no información que el usuario necesite leer.

El precio aparece siempre que haya con qué dividir, aunque no haya conversión: comprar 600 g de arveja por $2.975 no convierte nada, pero "$4,95/g" sigue siendo el dato útil.

Lo que sí cambia según la configuración es la marca de "falta configurar" (`°`), que solo aparece en unidades **aisladas**: las que no figuran en ninguna fila de ninguna de las dos tablas. Gramo no la lleva, porque como raíz ya está bien.

Ese `°` es un botón: abre un modal con las equivalencias ya registradas para ese producto (5 por página, más recientes primero), donde se puede seleccionar una para editarla o crear una nueva sin salir del checkout. Es el mismo CRUD de `/dashboard/equivalences`, pero acotado al producto de la fila y con la unidad de compra preseleccionada.

Nada de esto se persiste calculado: el desglose se computa al vuelo, así que corregir un factor arregla también lo ya registrado. Ambas tablas se administran desde la pantalla **Equivalencias** (`/dashboard/equivalences`).

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
