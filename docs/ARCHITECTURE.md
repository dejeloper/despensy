# Arquitectura de Despensy

Este documento describe **cómo** se construye Despensy: capas, flujo de datos y decisiones técnicas estructurales. Las reglas de negocio (qué es correcto para el dominio) están en `docs/DOMAIN.md`; las reglas de sintaxis/estilo por stack están en `docs/BACKEND_CONVENTIONS.md` y `docs/FRONTEND_CONVENTIONS.md`.

> `ProductController`, `ChecklistController` y `ChecklistItemController` ya siguen este patrón (Service para la lógica, Resource para la respuesta). `CategoryController`, `PlaceController` y `UnitController` son CRUD simple sin lógica adicional, así que no tienen Service dedicado — eso es correcto según el criterio de la sección siguiente, no una migración pendiente.

## Capas y responsabilidad única

```
Request → Form Request (valida) → Controller (orquesta) → Service (lógica + queries) → Model (Eloquent)
                                                                     ↓
                                                  Inertia::render(view, [Resource::collection/make(...)])
```

- **Form Request**: única fuente de validación. Un Form Request por acción de escritura.
- **Controller**: recibe la petición ya validada, llama a un método de Service, pasa el resultado (ya transformado por un Resource) a `Inertia::render()`. Sin queries Eloquent, sin lógica condicional de negocio.
- **Service**: contiene las queries y la lógica de negocio. Un Service por responsabilidad de dominio (no uno por entidad CRUD si la entidad no tiene lógica más allá de crear/actualizar/borrar — ver más abajo cuándo un Service es necesario).
- **Model**: relaciones, casts, scopes de filtrado simple (`scopeEnabled`, `scopeSearch`), accessors triviales. Nada que dispare una subquery de negocio compleja.
- **API Resource**: única forma de convertir un Model (o colección) en los datos que recibe React. Se usa siempre en el Controller — nunca se pasa un Model o `Collection` de Eloquent directo a `Inertia::render()`.

## Cuándo crear un Service (y cuándo no)

- CRUD simple sin lógica adicional (ej. `Category`, `Place`, `Unit` tal como son hoy: crear/editar/borrar sin reglas especiales) **no necesita** un Service dedicado — el Controller puede llamar directamente al Model (`Category::create($request->validated())`) sin perder el patrón, porque no hay lógica que orquestar.
- Un Service es obligatorio cuando existe alguna de estas condiciones:
  - Hay una **query compuesta** (joins, subqueries, agregaciones) — ejemplo real: el cálculo de "última compra" de un producto que hoy vive inline en `ProductController::index`.
  - Hay una **regla de negocio con más de un paso** — ejemplo: crear una checklist debe primero cerrar/cancelar la anterior (`docs/DOMAIN.md`).
  - La misma lógica se necesita en **más de un lugar** (controlador + comando artisan + job, etc.).
- Nombrar el Service por lo que hace, no por la entidad que toca: `ProductLastPurchaseService`, `ChecklistOpenerService` — no `ProductService` genérico que termine acumulando métodos sin relación.

## Flujo de datos con Inertia

- Los datos que llegan a una página React son siempre el resultado de un API Resource (`ProductResource::collection($products)`, no `$products` crudo).
- El tipo TypeScript en `types/business/*.d.ts` debe reflejar exactamente la forma del Resource correspondiente — si el Resource cambia, el tipo cambia en el mismo cambio.
- Mensajes de éxito/error viajan por `redirect()->with('success'|'error', $mensaje)`, ya usado consistentemente — se mantiene ese mecanismo, no se introduce un sistema de notificaciones paralelo sin justificarlo.

## Decisión: integridad referencial vía Foreign Keys, no SoftDeletes

Despensy usa `onDelete('restrict'|'cascade'|'set null')` de forma deliberada según el tipo de relación, en vez de `SoftDeletes`:

- `restrict` donde borrar rompería historial o integridad de negocio (`category_id` en `products`, `product_id` en `checklist_items`).
- `cascade` donde el hijo no tiene sentido sin el padre (`checklist_id` en `checklist_items`).
- `set null` donde la referencia es informativa y opcional (`unit_id_planned`, `unit_id_bought`, `place_id` en `checklist_items`).

Esta es la estrategia oficial del proyecto. **No se introduce `SoftDeletes`** en los modelos de negocio salvo que surja un requisito de negocio explícito (por ejemplo, "quiero poder restaurar un producto borrado por error") — en ese caso es una decisión a tomar conscientemente, no un default a aplicar por rutina.

## Decisión: paginación 100% client-side

Todos los listados (`Category`, `Place`, `Unit`, `Product`) traen el dataset completo del servidor y paginan/filtran en el cliente vía `use-client-pagination`. Es una decisión válida mientras el volumen de datos sea el de un uso personal (cientos de filas, no decenas de miles).

**Umbral para reconsiderar**: si alguna tabla de negocio supera ~2000 filas para un usuario, o si el tiempo de carga inicial de un listado se vuelve perceptible, se debe migrar esa entidad a paginación server-side (paginador nativo de Eloquent + Resource paginado) en vez de seguir escalando el patrón actual. No se hace la migración preventivamente sin ese síntoma.

## SOLID aplicado a Despensy (lectura práctica, no académica)

- **S**: un Service resuelve una responsabilidad de negocio, no "todo lo relacionado a Product". Un componente React resuelve una vista/interacción, no "toda la pantalla de productos".
- **O**: los `structure.tsx` (definición de columnas) permiten extender un listado (agregar columna) sin modificar el componente de tabla genérico (`DataTable`/`DataCards`).
- **L**: cualquier implementación de una relación Eloquent (`belongsTo`, `hasMany`) debe comportarse como Eloquent espera — no se sobreescriben métodos de relación para devolver algo distinto a lo que el tipo declara.
- **I**: los Form Requests son específicos por acción (`ProductRequest` para store/update de Product), no un validador genérico compartido entre entidades no relacionadas.
- **D**: los Controllers dependen de Services por su comportamiento (inyectados vía constructor o resueltos por el contenedor), no instancian lógica de negocio inline que los acopla a detalles de implementación.
