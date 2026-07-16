# Despensy — Punto de entrada para asistentes de IA

Despensy es una herramienta personal para decidir mejor qué comprar y dónde. Stack: **Laravel 12 + Inertia.js 2 + React 19 + TypeScript**. No es un proyecto Angular — las convenciones Angular de la configuración global no aplican aquí.

Este archivo es solo un índice. La documentación real vive en `docs/` y en `AI_RULES.md`. Léelos antes de escribir código:

| Documento                                                        | Cuándo leerlo                                                                    |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`AI_RULES.md`](./AI_RULES.md)                                   | Siempre, antes de tocar cualquier archivo. Reglas de comportamiento para IA.     |
| [`docs/PROJECT.md`](./docs/PROJECT.md)                           | Para entender qué es y qué NO es Despensy.                                       |
| [`docs/DOMAIN.md`](./docs/DOMAIN.md)                             | Antes de tocar Product, Category, Place, Unit, Checklist, ChecklistItem o State. |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)                 | Antes de crear un Controller, Service o Resource nuevo.                          |
| [`docs/BACKEND_CONVENTIONS.md`](./docs/BACKEND_CONVENTIONS.md)   | Antes de escribir PHP.                                                           |
| [`docs/FRONTEND_CONVENTIONS.md`](./docs/FRONTEND_CONVENTIONS.md) | Antes de escribir React/TypeScript.                                              |
| [`docs/DATABASE.md`](./docs/DATABASE.md)                         | Antes de crear o modificar una migración.                                        |
| [`planning.md`](./planning.md)                                   | Backlog de funcionalidad. No se modifica desde una sesión de documentación.      |

No copies esta tabla en otros documentos; si necesitas contexto, sigue el enlace.
