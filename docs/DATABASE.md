# Convenciones de base de datos

## Naming

- Tablas: plural, snake_case (`products`, `checklist_items`, `states`).
- Foreign keys: `<entidad_singular>_id` (`category_id`, `product_id`), salvo cuando una tabla referencia la misma entidad en más de un rol — en ese caso se prefija con el propósito, no con la tabla: `unit_id_planned` / `unit_id_bought` en `checklist_items`, no `unit_id_1`/`unit_id_2`. Se sigue este mismo criterio para cualquier FK futura con doble rol.
- Columnas booleanas de habilitación: `enabled` (no `is_active`, no `status`) — ya consistente en `categories`, `places`, `units`, `products`, `states`.

## Estrategia de integridad referencial

Decisión oficial (ver justificación completa en `docs/ARCHITECTURE.md`): **FK con `onDelete` explícito, sin `SoftDeletes`**. Regla para elegir el valor al crear una FK nueva:

| Situación | `onDelete` |
|---|---|
| Borrar el padre debería ser imposible mientras haya hijos (protege historial/integridad) | `restrict` |
| El hijo no tiene sentido sin el padre (es parte de él) | `cascade` |
| La referencia es informativa/opcional, perderla no rompe nada | `set null` (requiere la columna FK `nullable()`) |

Ejemplos ya aplicados: `products.category_id` → `restrict`; `checklist_items.checklist_id` → `cascade`; `checklist_items.place_id` / `unit_id_planned` / `unit_id_bought` → `set null`.

## Patrón de tabla `states` centralizada

En vez de una tabla de estados por entidad (`checklist_states`, `product_states`, ...), Despensy usa una única tabla `states` con columna `type` para distinguir a qué entidad aplica cada grupo de estados. Ventaja para este proyecto: pocas entidades tienen estados, y centralizarlos evita migraciones repetidas para el mismo concepto. Si en el futuro una entidad necesita estados con columnas muy distintas a `name/type/color/icon/enabled`, se evalúa una tabla dedicada en ese momento — no se fuerza todo a caber en `states`.

## Columnas obligatorias en toda tabla de negocio

- `id` autoincremental.
- `timestamps()` (`created_at`, `updated_at`).
- `enabled` (boolean, default `true`) en tablas de catálogo (Category, Place, Unit, State) — permite deshabilitar sin borrar y sin necesidad de SoftDeletes, coherente con la decisión de integridad referencial de arriba.
- Las tablas transaccionales (`checklists`, `checklist_items`) no llevan `enabled` — su estado de ciclo de vida vive en `state_id` / `was_bought`, no en un flag de habilitación.

## Precisión numérica

- Montos monetarios: `decimal(10, 2)` — ya usado en `checklist_items.unit_price`/`total_price`. Cualquier columna monetaria nueva sigue esta misma precisión, no `float`/`double`.
- Cantidades (`quantity_planned`, `quantity_bought`): `integer`. Si en el futuro se necesitan cantidades fraccionarias (ej. "1.5 kg"), es un cambio de tipo a evaluar conscientemente, no algo a mezclar silenciosamente con enteros.

## Antes de escribir una migración nueva

1. Confirmar que el nombre de columna no choca con una convención ya usada en otra tabla del dominio.
2. Elegir `onDelete` según la tabla de arriba, explícitamente — nunca dejar el default de Laravel sin pensarlo.
3. Verificar contra `docs/DOMAIN.md` que la columna representa lo que el negocio necesita hoy, no un campo especulativo (ver `docs/TECH_DEBT.md` para el caso de `price`/`stock` que nunca debieron estar en el Model/Request si no están en la migración).
