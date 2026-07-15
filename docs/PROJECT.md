# Visión de Despensy

## Qué es

Despensy es una herramienta **personal** para tomar mejores decisiones al momento de comprar productos de despensa: qué comprar, dónde y a qué precio, basándose en el historial real de compras.

## Filosofía

**Simplicidad sobre control perfecto.** La información debe ser clara, confiable y útil — no exhaustiva. Ante la duda entre modelar algo con precisión contable (inventario, stock exacto, control de existencias) o modelarlo de forma simple orientada a decisión de compra, se elige lo segundo.

Pregunta guía para cualquier funcionalidad nueva: **¿esto ayuda a decidir mejor qué comprar y dónde hacerlo?** Si la respuesta no es clara, la funcionalidad no entra todavía, sin importar cuánto "sentido técnico" tenga.

## Qué NO es Despensy

Estos límites son deliberados y evitan que el proyecto crezca hacia algo que no busca resolver:

- **No es un sistema de inventario de negocio.** No lleva stock exacto, no gestiona múltiples bodegas, no tiene control de existencias en tiempo real. Por eso `products` no tiene `stock`: la cantidad relevante es la de cada compra (`checklist_items.quantity_bought`), no una existencia acumulada.
- **No es multiusuario colaborativo real.** Cada usuario tiene su propia despensa y sus propias listas; no hay listas compartidas entre usuarios ni permisos entre cuentas.
- **No es un e-commerce ni gestiona pagos.** Los precios que se registran son datos históricos de referencia, no transacciones.
- **No es un ERP ni ledger contable.** No hay doble entrada, no hay conciliación de caja, no hay reportes fiscales.

Si una tarea empuja al proyecto hacia alguno de estos límites, es una señal para preguntar antes de implementar, no para resolverlo con una abstracción "por si acaso".

## Flujo principal de uso (el que todo debe servir)

1. Ver los productos de mi despensa, con su última compra (precio, lugar, fecha).
2. Agregar productos a mi lista de compra activa.
3. Comprar usando la lista, idealmente desde el móvil.
4. Consultar el historial de compras de cada producto para decidir mejor la próxima vez.

Cualquier funcionalidad que no sirva a uno de estos cuatro pasos es candidata a "mejora futura" (backlog), no a trabajo inmediato — ver `planning.md` para el estado actual de cada paso.

## Relación con otros documentos

- El **qué falta por construir** vive en `planning.md` (no se edita desde documentación arquitectónica).
- El **cómo se construye** vive en `docs/ARCHITECTURE.md`, `docs/BACKEND_CONVENTIONS.md` y `docs/FRONTEND_CONVENTIONS.md`.
- Las **reglas del negocio** (qué es un Product, qué es una Checklist, cuándo se cierra) viven en `docs/DOMAIN.md`.
