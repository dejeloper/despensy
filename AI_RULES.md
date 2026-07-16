# Reglas para asistentes de IA en Despensy

Este documento es una checklist operativa. No es un resumen de arquitectura (eso está en `docs/`); es una lista de comportamientos concretos que cualquier IA (Claude, Codex, Gemini u otra) debe seguir al trabajar en este repositorio.

---

## 1. Antes de escribir código

1. Lee `docs/DOMAIN.md` si la tarea toca Product, Category, Place, Unit, Checklist, ChecklistItem o State — no asumas el modelo de datos, verifícalo contra la migración real en `database/migrations/`. Ya ha pasado que un Model/Request/Resource referenciaba columnas que no existían en la tabla real (`price`/`stock`/`place_id`/`unit_id` en `Product`) — antes de escribir una regla o un campo nuevo, confirma contra la migración, no contra el código existente.
2. Busca si ya existe un Service, hook, componente o tipo que resuelva lo que vas a construir. Rutas típicas donde buscar:
   - Backend: `app/Services/business/`, `app/Http/Resources/`, `app/Models/business/`.
   - Frontend: `resources/js/hooks/`, `resources/js/components/{business,shared,ui}/`, `resources/js/structures/`.
3. Sigue `docs/ARCHITECTURE.md` para el patrón Controller→Service→Resource. `ProductController`, `ChecklistController` y `ChecklistItemController` ya lo siguen (Service para lógica compuesta, Resource para la respuesta); `CategoryController`/`PlaceController`/`UnitController` son CRUD simple sin lógica adicional y por eso no tienen Service dedicado — eso es intencional, no deuda (ver el criterio de "cuándo crear un Service" en `docs/ARCHITECTURE.md`), así que sí sirven de ejemplo de patrón para CRUD sin lógica extra.

## 2. Reutilización antes que creación

- No crear un componente de React si uno en `components/ui/` o `components/shared/` ya resuelve el caso.
- No crear un hook si `use-client-pagination`, `use-inertia-loading` u otro existente ya cubre la necesidad.
- No crear un Service nuevo si la lógica cabe razonablemente en uno existente sin violar su responsabilidad única (ver `docs/ARCHITECTURE.md`).
- Antes de agregar un tipo TypeScript nuevo en `types/business/`, confirma que no exista ya uno equivalente. No crees un tipo, Resource o página sin que algo lo use ya — un tipo huérfano (`consumer.d.ts`, ya eliminado) es una señal de que se documentó/tipó una funcionalidad que nunca se construyó en el backend.

## 3. Cómo deben verse las piezas nuevas

- **Controlador nuevo**: solo recibe la petición, llama a un Service y devuelve una vista Inertia con datos ya transformados por un Resource. Cero queries Eloquent directas en el controlador.
- **Model nuevo**: relaciones, casts, scopes y accessors simples únicamente. Ninguna query de negocio compleja.
- **Form Request nuevo**: única fuente de validación de esa acción. Incluye `messages()` en español, siguiendo el estilo ya usado en `ProductRequest`/`CategoryRequest`.
- **API Resource nuevo**: se usa de verdad en el controlador — nunca se escribe un Resource que ningún controlador invoca.
- **Componente React nuevo**: una responsabilidad clara; si mezcla fetch/lógica/presentación, se separa en hook + componente.
- **Hook nuevo**: una preocupación por hook, reutilizable fuera de la página donde nació.

## 4. Cambios que nunca debe hacer una IA sin autorización explícita

- Modificar o reorganizar `planning.md`. Es el backlog del proyecto y está fuera de alcance de cualquier tarea de documentación o refactor, salvo que el usuario lo pida por su nombre.
- Instalar una dependencia nueva (composer o npm) sin decir antes qué problema resuelve y por qué no se puede resolver con lo ya instalado.
- Cambiar la estrategia de integridad referencial (FK `restrict`/`cascade`/`set null`, ver `docs/ARCHITECTURE.md`) por SoftDeletes o viceversa — es una decisión ya tomada y documentada, no un detalle de implementación libre.
- Limpiar o refactorizar código no relacionado con la tarea pedida como efecto secundario. Si al trabajar en algo detectas una inconsistencia (un campo que referencia una columna inexistente, una relación rota, un patrón viejo sin migrar), dilo explícitamente y pregunta antes de tocarlo — no lo arregles de paso.
- Mover o renombrar archivos fuera del alcance pedido.
- Ampliar el alcance de una tarea pequeña para "aprovechar y refactorizar" algo relacionado sin decirlo primero.

## 5. Verificaciones obligatorias antes de dar una tarea por terminada

- `pnpm run types` (o `./node_modules/.bin/tsc --noEmit` si `pnpm` pide reinstalar dependencias) si se tocó TypeScript — no se aceptan errores nuevos de tipos.
- `./vendor/bin/pint --dirty` y `pnpm run format` sobre los archivos tocados antes de dar la tarea por terminada.
- Si se tocó una migración, confirmar que el Model/Request/Resource/tipo TS correspondientes reflejan exactamente las columnas reales.
- Si se agregó una página Inertia nueva, confirmar que corriste `vite build` (o que el dev server está corriendo) — `app.blade.php` exige que el componente exista en el manifest de Vite; si no, la ruta responde 500 aunque el backend esté bien.
- Si se agregó un endpoint nuevo, confirmar que la ruta está registrada en `routes/web.php` dentro del grupo `auth`+`verified` y con el prefijo `dashboard` si es una vista de negocio.

## 6. Autonomía y eficiencia

- **No pedir permiso.** Ejecuta directamente las ediciones, comandos y creaciones de archivos que la tarea requiera. No preguntes "¿Quieres que...?" ni confirmes acciones antes de hacerlas — actúa y reporta el resultado.
- **No ejecutar tests a menos que se pida explícitamente.** Los tests unitarios y de integración solo corren si el usuario los solicita por nombre. Si necesitas verificar algo, busca evidencia en el código (lint, tipos, lógica) sin invocar el runner de tests.
