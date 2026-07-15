# Deuda técnica conocida

Registro vivo de inconsistencias detectadas entre el código real y las convenciones documentadas en `docs/`. Distinto de `planning.md`: eso es backlog de **funcionalidad** nueva; esto es backlog de **consistencia** del código existente. No se edita `planning.md` para reflejar esta lista ni viceversa.

Cuando se resuelve un ítem, se marca `[x]` con la fecha, no se borra la línea — así queda historial de qué se corrigió y cuándo.

## Alta prioridad (bloquea que el código sirva de ejemplo confiable)

- [ ] **`Product` referencia columnas inexistentes.** `app/Models/business/Product.php` tiene `price`/`stock` en `$fillable` y `$casts`, más `scopeLowStock()`, `hasLowStock()` y `getTotalValueAttribute()`. La migración `2025_08_24_235228_create_products_table.php` no tiene esas columnas. `app/Http/Requests/business/ProductRequest.php` las valida y `app/Http/Resources/ProductResource.php` las expone. Acción: eliminar `price`/`stock` y los métodos derivados de `Product`, `ProductRequest` y `ProductResource`; quitar `price?`/`stock?` de `resources/js/types/business/product.d.ts`. Ya señalado en `planning.md` como pendiente ("CORREGIR modelo Product.php").
- [ ] **Ningún controlador de negocio usa su API Resource.** `CategoryController`, `PlaceController`, `UnitController`, `ProductController` pasan modelos/arrays crudos a `Inertia::render()` en vez de `XResource::collection(...)`. Los cuatro Resources existen pero están muertos. Acción: al tocar cada controlador, migrarlo al patrón de `docs/ARCHITECTURE.md`.
- [ ] **No existe capa de Service.** Toda la lógica (incluidas queries con joins/subqueries en `ProductController::index`) vive en los controladores. Acción: crear `app/Services/business/` y mover ahí la lógica compuesta según el criterio de `docs/ARCHITECTURE.md`, empezando por la query de "última compra" de `ProductController::index`.

## Media prioridad

- [ ] **Validación inline en `ProductController::updatePrice`.** Usa `$request->validate([...])` en vez de un Form Request dedicado. Además valida `price`/`stock`, que no existen (ver ítem de arriba) — este método probablemente necesita rediseñarse junto con la migración a `ChecklistItem` en vez de seguir operando sobre campos de `Product`.
- [ ] **Tipo `Consumer` huérfano.** `resources/js/types/business/consumer.d.ts` no tiene modelo, controlador ni página asociada en el backend. Acción: confirmar si es un resto de una iteración anterior y eliminarlo, o si corresponde a algo planeado que aún no se documentó en `planning.md`.
- [ ] **Dominio Checklist/ChecklistItem/State sin capa de aplicación.** Las tablas existen en la base de datos pero no hay Model, Controller, Request ni Resource. No es "deuda" en el sentido estricto (es trabajo no iniciado, ya listado en `planning.md`), pero se registra aquí porque es la pieza más importante para que `docs/DOMAIN.md` dejе de ser aspiracional.

## Baja prioridad (no bloquea nada, pero genera fricción)

- [ ] **Formato inconsistente (tabs vs. espacios).** PHP: `ProductRequest.php` y la migración de `states` usan tabs; el resto usa 4 espacios. TypeScript: `category.d.ts`, `place.d.ts`, `unit.d.ts` usan tabs; `product.d.ts`, `consumer.d.ts` usan espacios. Prettier ya está configurado con `tabWidth: 4` (espacios) — solo falta correr `pnpm run format` sobre `resources/js/` y aplicar Pint (o un formateador PHP equivalente) sobre `app/`.
- [ ] **Cobertura de tests desigual.** Existen tests unitarios de modelo para Category/Place/Product/Unit (`tests/Unit/Models/business/`), pero ningún Feature test para los controladores de negocio, y ningún test de Service (porque no existe ningún Service todavía). Acción: a medida que se creen Services y se migren controladores según `docs/ARCHITECTURE.md`, cada uno lleva su test en el mismo cambio.

## Resueltos

- [x] 2026-07-15 — Eliminado `PLAN_DE_TRABAJO.md`, duplicado casi exacto de `planning.md`, para dejar una sola fuente de verdad de backlog.
