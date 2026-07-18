# Convenciones de backend (Laravel)

Reglas concretas para código PHP en Despensy. El _por qué_ de las capas está en `docs/ARCHITECTURE.md`; esto es el _cómo se escribe_.

## Organización de carpetas

- Todo lo de dominio (no auth, no settings) va bajo el namespace/carpeta `business/`: `app/Http/Controllers/business/`, `app/Http/Requests/business/`, `app/Models/business/`. Ya establecido con Category/Place/Unit/Product — se mantiene para Checklist/ChecklistItem/State.
- `app/Http/Resources/` es plano (sin subcarpeta `business/`) — así está hoy (`ProductResource`, `CategoryResource`, etc. sin namespace anidado). Se mantiene consistente: no se crea una excepción anidando resources nuevos.
- `app/Services/business/` para los Services de dominio (ej. `ProductLastPurchaseService`, `ChecklistLifecycleService`, `ChecklistItemService`).

## Controladores

- Métodos en el orden convencional de un resource controller: `index, create, store, edit, update, destroy` (+ métodos de acción específicos al final, como `complete`/`cancel` en `ChecklistController`).
- `index()` no arma queries con joins/subqueries — eso se delega a un Service (ver `docs/ARCHITECTURE.md` para cuándo es obligatorio; ejemplo real: `ProductLastPurchaseService`).
- Nunca `$request->validate([...])` inline — siempre un Form Request dedicado, aunque sea para una acción parcial.
- El único try/catch aceptable en un controlador es para traducir una excepción de integridad (ej. `restrict` de FK) a un mensaje de usuario en español, como ya hace `destroy()` en los controladores actuales. No se usa try/catch para tragar errores inesperados.
- Todo controlador de negocio se registra con `Route::resource(...)` dentro de `Route::prefix('dashboard')->group(...)` y del middleware `['auth', 'verified']`, siguiendo el patrón de `routes/web.php`.

## Form Requests

- `authorize()` devuelve `true` mientras el proyecto sea de un solo usuario dueño de sus datos; el día que haya autorización real por recurso, se revisa esta regla explícitamente (no se deja `true` "por costumbre" en ese escenario).
- `rules()` y `messages()` siempre presentes, con mensajes en español, siguiendo el estilo ya usado en `CategoryRequest`/`ProductRequest` (`'campo.regla' => 'Mensaje.'`).
- Reglas de unicidad que dependen de la ruta (`Rule::unique(...)->ignore($id)`) se resuelven leyendo el `id` desde `$this->route('recurso')?->id`, como ya hace `ProductRequest`.
- Las reglas deben validar exactamente las columnas que existen en la migración — antes de escribir una regla para un campo, confirmar que el campo existe en `database/migrations/`.

## Modelos

- `$fillable` explícito siempre (no `$guarded = []`).
- `$casts` solo para columnas que realmente existen en la migración correspondiente.
- Scopes con prefijo `scope` y nombre de acción (`scopeEnabled`, `scopeSearch`, `scopeByCategory`) — patrón ya establecido, se mantiene.
- Accessors (`getXAttribute`) solo para cómputos triviales de una fila (ej. formatear, concatenar). Cualquier cómputo que implique otra tabla o agregación va en un Service, no en un accessor.
- Relaciones con el tipo de retorno explícito en el docblock o en la firma (`BelongsTo`, `HasMany`) cuando se agregue una relación nueva — los modelos actuales no lo hacen consistentemente; el código nuevo sí lo declara.

## API Resources

- Un Resource por entidad expuesta al frontend, en `app/Http/Resources/` (plano, sin subcarpeta).
- El Resource se **usa** en el Controller (`ProductResource::collection(...)` o `ProductResource::make(...)`) — no se escribe un Resource que nunca se invoca.
- Relaciones anidadas se exponen con `whenLoaded()`, como ya hace `ProductResource` — así se evita forzar un eager load innecesario cuando el Resource se reutiliza en un contexto donde esa relación no se cargó.
- El Resource solo expone columnas reales del modelo — no se agregan campos "por si el frontend los necesita después".

## Migraciones

- Nombrar con el formato ya usado: `AAAA_MM_DD_HHMMSS_create_<tabla>_table.php` (snake_case, plural).
- `onDelete` explícito en toda foreign key, elegido según la regla de `docs/ARCHITECTURE.md` (`restrict` por defecto para relaciones que protegen historial, `cascade` para hijos dependientes, `set null` para referencias opcionales) — nunca se deja el comportamiento por defecto de Laravel sin pensarlo.
- Indentación con 4 espacios (Pint la aplica automáticamente — correr `vendor/bin/pint` antes de cerrar una tarea que tocó PHP).

## Manejo de errores y mensajes al usuario

- Todos los mensajes de éxito/error visibles al usuario están en español, en el mismo tono breve y directo ya usado ("Producto creado exitosamente.", "No se pudo eliminar el producto. Puede estar en uso.").
- Los errores de validación los produce el Form Request; los errores de negocio (ej. "ya tienes una lista abierta") se lanzan desde el Service como una excepción de dominio específica, capturada en el Controller para traducirse a un mensaje flash — no como un `abort(400, 'texto')` disperso.

## Tests

- Los tests de modelo (`tests/Unit/Models/business/`) verifican relaciones, scopes y casts — patrón usado para Category/Place/Product/Unit/State/Checklist/ChecklistItem.
- Todo Service con lógica de negocio lleva su test unitario en `tests/Unit/Services/business/` (ver `ProductLastPurchaseServiceTest`, `ChecklistLifecycleServiceTest`, `ChecklistItemServiceTest` como referencia) — se escribe en el mismo cambio que crea el Service, no después.
- Los flujos de controlador con reglas de negocio o autorización llevan un Feature test en `tests/Feature/` (ver `tests/Feature/Checklist/` y `tests/Feature/business/` como referencia) — se escribe en el mismo cambio que crea o modifica el controlador.
