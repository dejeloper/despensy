# Convenciones de frontend (Inertia + React + TypeScript)

Reglas concretas para código en `resources/js/`. Stack real: Inertia.js 2 + React 19 + TypeScript, con Tailwind y componentes Radix/shadcn. **No es Angular** — ignora cualquier convención Angular de la configuración global al trabajar aquí.

## Organización de carpetas (ya establecida, se mantiene)

- `pages/<recurso>/{index,create,edit}.tsx` — una página Inertia por acción. No se meten `create` y `edit` en un mismo archivo "por ahorrar código"; si comparten formulario, el formulario se extrae a un componente compartido y cada página lo usa.
- `structures/<recurso>.structure.tsx` — definición de columnas de tabla (`Column<T>[]`) para ese recurso. Todo listado nuevo define su archivo de estructura; no se ponen columnas inline dentro de la página `index.tsx`.
- `hooks/` — hooks reutilizables entre páginas (`use-client-pagination`, `use-inertia-loading`, etc.). Antes de escribir un hook nuevo, revisar si ya existe uno que resuelva el caso.
- `components/business/` — componentes específicos de un dominio (ej. tarjeta de producto).
- `components/ui/` — primitivos de UI (Radix/shadcn). No se le agrega lógica de negocio.
- `components/shared/` — compartidos entre features pero sin ser primitivos genéricos (ej. `SearchBar`, `DataTable`, `DataCards`).
- `types/business/` — un archivo por entidad de dominio (`product.d.ts`, `category.d.ts`, ...), reflejando exactamente el API Resource correspondiente del backend.

## Tipado

- Todo prop que venga de Inertia (`usePage().props`) tiene un tipo definido en `types/business/` o `types/index.d.ts` — nunca `any` ni objeto anónimo para datos de dominio.
- El tipo de una entidad se actualiza en el mismo cambio que su API Resource — si el backend deja de exponer un campo, el tipo lo refleja de inmediato.
- Se prefiere `interface` para formas de objeto de dominio y `type` para uniones/alias; el código nuevo usa `interface` para entidades cuando no necesite unión.
- Los tipos de paginación (`Paginated<Entidad>`) siguen la forma ya usada: `{ data: T[]; current_page; last_page; per_page; total; links: {url, label, active}[] }`. No se inventa una forma distinta por recurso.

## Páginas y componentes

- Una página Inertia orquesta: pide datos vía props, arma el estado de UI (filtros, paginación vía hook), y renderiza componentes — no contiene lógica de transformación de datos pesada inline.
- Un componente se divide cuando mezcla más de una responsabilidad (ej. fetch/estado + presentación) o cuando su JSX crece más allá de lo legible en una pantalla. No hay un número mágico de líneas; el criterio es "¿puedo describir este componente en una frase sin usar 'y'?".
- La lógica de negocio de UI (cálculos, formateo, reglas de habilitado/deshabilitado de un botón) vive en un hook, no en el cuerpo del componente ni en el JSX.
- **Toda página nueva en `pages/<recurso>/` debe existir como archivo antes de registrar su ruta.** `resources/views/app.blade.php` usa `@vite([..., "resources/js/pages/{$page['component']}.tsx"])` — si el componente no está en el manifest de Vite, la ruta responde 500 aunque el backend esté perfecto. Después de crear una página nueva, correr `pnpm run build` (o tener `pnpm run dev` corriendo) antes de darla por terminada.

## El patrón `structure.tsx`

- Cada columna (`Column<T>`) declara `key`, `label`, y opcionalmente `render` para presentación custom (badges, formateo). Ejemplo ya establecido en `products.structure.tsx`.
- Las acciones de fila (editar/eliminar) se declaran en el mismo archivo de estructura junto a las columnas, no dispersas en el componente de tabla.
- Un `structure.tsx` no hace peticiones ni contiene lógica de negocio — solo define cómo se ve cada columna a partir de los datos que ya llegaron.

## Estado y datos

- Paginación y búsqueda de listados: siempre vía `use-client-pagination` mientras aplique la decisión de `docs/ARCHITECTURE.md` (dataset completo del servidor, filtrado en cliente). Si un listado migra a paginación server-side, deja de usar este hook y se documenta el cambio.
- Formularios usan el helper de formularios de Inertia (`useForm`) para mantener consistencia con el flujo `redirect()->with('success'|'error', ...)` del backend.
- No se introduce una librería de manejo de estado global (Redux, Zustand, etc.) sin justificar por qué el estado de página + props de Inertia no alcanza — hoy el proyecto no la necesita y no debe agregarse preventivamente.

## Estilo y formato

- Tailwind vía las clases utilitarias existentes; `clsx`/`cn` para condicionales, ya configurado en Prettier (`tailwindFunctions`).
- Prettier (`tabWidth: 4`, espacios, comillas simples) es la fuente de verdad de formato — se corre `pnpm run format` antes de dar una tarea por terminada si se tocaron archivos `.tsx`/`.ts`.
- `pnpm run lint` y `pnpm run types` deben pasar sin errores nuevos antes de cerrar una tarea.

## Qué no hacer

- No usar `npm`/`yarn` — el proyecto usa `pnpm` exclusivamente (ver `package.json`/`pnpm-lock.yaml`).
- No crear un tipo, componente o página "por si se necesita después" sin que algo lo use ya.
