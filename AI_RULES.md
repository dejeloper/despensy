# Reglas para asistentes de IA en Despensy

Este documento es una checklist operativa. No es un resumen de arquitectura (eso está en `docs/`); es una lista de comportamientos concretos que cualquier IA (Claude, Codex, Gemini u otra) debe seguir al trabajar en este repositorio.

---

## 1. Antes de escribir código

1. Lee `docs/DOMAIN.md` si la tarea toca Product, Category, Place, Unit, Checklist, ChecklistItem o State — no asumas el modelo de datos, verifícalo contra la migración real en `database/migrations/`.
2. Lee `docs/TECH_DEBT.md` — si la tarea toca `Product`, ten en cuenta que el modelo, el Form Request, el Resource y el tipo TypeScript todavía referencian `price`/`stock`, campos que **no existen** en la tabla `products`. No los uses como referencia de "cómo se hacen las cosas aquí".
3. Busca si ya existe un Service, hook, componente o tipo que resuelva lo que vas a construir. Rutas típicas donde buscar:
   - Backend: `app/Services/business/`, `app/Http/Resources/`, `app/Models/business/`.
   - Frontend: `resources/js/hooks/`, `resources/js/components/{business,shared,ui}/`, `resources/js/structures/`.
4. Si la tarea es sobre un controlador existente (`CategoryController`, `PlaceController`, `UnitController`, `ProductController`), estos todavía no siguen el patrón Controller→Service→Resource descrito en `docs/ARCHITECTURE.md` (hacen queries directas y devuelven modelos crudos a Inertia). No los copies como ejemplo de buen patrón; sigue `docs/ARCHITECTURE.md` para código nuevo.

## 2. Reutilización antes que creación

- No crear un componente de React si uno en `components/ui/` o `components/shared/` ya resuelve el caso.
- No crear un hook si `use-client-pagination`, `use-inertia-loading` u otro existente ya cubre la necesidad.
- No crear un Service nuevo si la lógica cabe razonablemente en uno existente sin violar su responsabilidad única (ver `docs/ARCHITECTURE.md`).
- Antes de agregar un tipo TypeScript nuevo en `types/business/`, confirma que no exista ya uno equivalente (ejemplo real de lo que hay que evitar: `consumer.d.ts` es un tipo sin modelo/controlador asociado — no lo tomes como referencia para nada nuevo).

## 3. Cómo deben verse las piezas nuevas

- **Controlador nuevo**: solo recibe la petición, llama a un Service y devuelve una vista Inertia con datos ya transformados por un Resource. Cero queries Eloquent directas en el controlador.
- **Model nuevo**: relaciones, casts, scopes y accessors simples únicamente. Ninguna query de negocio compleja.
- **Form Request nuevo**: única fuente de validación de esa acción. Incluye `messages()` en español, siguiendo el estilo ya usado en `ProductRequest`/`CategoryRequest`.
- **API Resource nuevo**: se usa de verdad en el controlador (a diferencia de los Resources actuales, que existen pero no se usan — no repitas ese error).
- **Componente React nuevo**: una responsabilidad clara; si mezcla fetch/lógica/presentación, se separa en hook + componente.
- **Hook nuevo**: una preocupación por hook, reutilizable fuera de la página donde nació.

## 4. Cambios que nunca debe hacer una IA sin autorización explícita

- Modificar o reorganizar `planning.md`. Es el backlog del proyecto y está fuera de alcance de cualquier tarea de documentación o refactor, salvo que el usuario lo pida por su nombre.
- Instalar una dependencia nueva (composer o npm) sin decir antes qué problema resuelve y por qué no se puede resolver con lo ya instalado.
- Cambiar la estrategia de integridad referencial (FK `restrict`/`cascade`/`set null`, ver `docs/ARCHITECTURE.md`) por SoftDeletes o viceversa — es una decisión ya tomada y documentada, no un detalle de implementación libre.
- Eliminar `price`/`stock` de `Product` (u otro código marcado en `docs/TECH_DEBT.md`) como efecto secundario de una tarea no relacionada. Esa limpieza se hace como tarea propia, explícita.
- Mover o renombrar archivos fuera del alcance pedido.
- Ampliar el alcance de una tarea pequeña para "aprovechar y refactorizar" algo relacionado. Si ves algo que debería refactorizarse, dilo y regístralo en `docs/TECH_DEBT.md`; no lo hagas de paso.

## 5. Verificaciones obligatorias antes de dar una tarea por terminada

- `php artisan test` (o el subconjunto relevante) si se tocó backend con lógica de negocio.
- `pnpm run types` si se tocó TypeScript — no se aceptan errores nuevos de tipos.
- `pnpm run lint` si se tocó código React.
- Si se tocó una migración, confirmar que el Model/Request/Resource/tipo TS correspondientes reflejan exactamente las columnas reales (evitar repetir el caso `price`/`stock`).
- Si se agregó un endpoint nuevo, confirmar que la ruta está registrada en `routes/web.php` dentro del grupo `auth`+`verified` y con el prefijo `dashboard` si es una vista de negocio.
