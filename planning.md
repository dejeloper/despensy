# Plan de Trabajo - Despensy

Herramienta personal para tomar mejores decisiones al momento de comprar productos de despensa.

---

## Plan

### Base de Datos

- [x] Tabla `products` (nombre, descripción, imagen, categoría, estado) - SIN price ni stock
- [x] Tabla `categories` (con colores e iconos)
- [x] Tabla `places` (lugares de compra con colores)
- [x] Tabla `units` (unidades de medida)
- [x] Tabla `checklists` (listas de compra vinculadas a usuarios con state_id)
- [x] Tabla `checklist_items` (items de cada lista con precios, cantidades, lugares)
- [x] Tabla `states` (estados centralizados)

### Seeders

- [x] Datos de prueba para categories, places, units
- [x] Datos de prueba para productos
- [x] Seeder de estados
- [x] Seeder de checklist con items de ejemplo

### Backend - Controladores

- [x] CRUD completo para Categories
- [x] CRUD completo para Places
- [x] CRUD completo para Units
- [x] CRUD completo para Products (sin métodos show, lastPurchase, purchaseHistory)
- [x] Todos los controladores traen todos los datos (preparados para búsqueda/paginación del cliente)

### Frontend - Vistas

- [x] Vista index para Categories (con búsqueda global y paginación del cliente)
- [x] Vista index para Places (con búsqueda global y paginación del cliente)
- [x] Vista index para Units (con búsqueda global y paginación del cliente)
- [x] Vista index para Products (con búsqueda global y paginación del cliente)
- [x] Componente reutilizable `SearchBar`
- [x] Hook personalizado `useClientPagination` para búsqueda y paginación
- [x] Componentes `DataTable` y `DataCards` para visualización responsive

### Modelos Eloquent (Alta Prioridad)

- [x] Eliminar campos `price` y `stock` de la tabla `products` - YA NO NECESARIO (la migración no los tiene)
- [ ] **CORREGIR modelo Product.php** - Eliminar price y stock del $fillable y $casts (la migración no los tiene)
- [ ] **Crear modelo State.php** con relaciones
- [ ] **Crear modelo Checklist.php** con relaciones (State, Items, User)
- [ ] **Crear modelo ChecklistItem.php** con todas las relaciones (Producto, unidad planeada, unidad comprada, lugar)

### Lógica de Negocio (Alta Prioridad)

- [ ] **Helper o Service para obtener última compra de un producto**
    - Último precio pagado
    - Última fecha de compra
    - Último lugar de compra
    - Reutilizable en controladores y vistas

- [ ] **Regla de negocio: Solo una lista abierta por usuario**
    - Validación en ChecklistController
    - Middleware o método que cierre lista anterior al crear nueva
    - Tests para verificar la regla

- [ ] **Normalizar estados de checklist**
    - Usar solo: open, in_progress, closed, cancelled
    - Eliminar cualquier referencia a estados hardcoded como strings
    - Centralizar lógica de cambio de estados

### Vista Principal de Productos (CRÍTICA - Máxima Prioridad)

- [ ] **Rediseñar vista de productos como "Despensa"**
    - Mostrar último precio (desde última compra)
    - Mostrar última fecha de compra
    - Mostrar último lugar de compra
    - Indicador visual si está en lista activa o no
- [ ] **Filtros en vista de productos**
    - Filtro por categoría
    - Filtro por estado (en lista / fuera de lista)
    - Mantener búsqueda global existente

- [ ] **Acción rápida: Agregar a lista activa**
    - Botón "+/−" en cada producto
    - Si no hay lista abierta, crearla automáticamente
    - Feedback visual inmediato
    - Funcionar desde el listado sin modal

- [ ] **Acción rápida: Quitar de lista activa**
    - Mismo botón "+/−" (toggle)
    - Actualización inmediata
    - Confirmación opcional solo si ya tiene datos de compra

### Vista de Lista de Compra Activa (Alta Prioridad)

- [ ] **Nueva vista: /checklists/active**
    - Diseño optimizado para móvil
    - Lista de productos agregados
    - Checkbox para marcar como comprado
    - Campos rápidos: cantidad, precio, lugar
- [ ] **Flujo de marcar producto como comprado**
    - Registrar precio pagado
    - Registrar cantidad comprada
    - Registrar lugar de compra
    - Registrar fecha de compra
    - Actualizar estado del item en la lista

- [ ] **Acción: Completar lista**
    - Cambiar estado a "closed"
    - Validar que no se pueda modificar después
    - Redirigir a resumen o a crear nueva lista

- [ ] **Acción: Cancelar lista**
    - Cambiar estado a "cancelled"
    - No registrar compras
    - Permitir crear nueva lista

### Vista de Detalle de Producto (Prioridad Media)

- [ ] **Nueva vista: /products/{id}**
    - Información básica del producto
    - Último precio, fecha y lugar
    - Historial de compras (tabla simple)
    - Gráfica opcional de evolución de precio

- [ ] **Sección de historial**
    - Listar compras anteriores
    - Fecha, precio, cantidad, lugar
    - Ordenado por fecha descendente

### Backend - Controllers Checklist (Alta Prioridad)

- [ ] **Crear ChecklistController**
    - index() - Ver listas del usuario
    - active() - Ver lista activa
    - store() - Crear nueva lista (cerrar anterior)
    - complete(id) - Completar lista
    - cancel(id) - Cancelar lista

- [ ] **Crear ChecklistItemController**
    - addProduct(checklist_id, product_id) - Agregar producto a lista
    - removeProduct(checklist_id, product_id) - Quitar producto
    - markAsBought(item_id) - Marcar como comprado con datos
    - update(item_id) - Actualizar datos del item

- [x] Actualizar ProductController - Ya tiene CRUD completo
- [ ] Agregar método show(id) para detalle
- [ ] Agregar método lastPurchase(id)
- [ ] Agregar método purchaseHistory(id)

### Frontend - Componentes (Alta Prioridad)

- [ ] **Componente ProductCard mejorado**
    - Mostrar último precio
    - Mostrar última compra
    - Botón toggle para agregar/quitar de lista
    - Indicador visual de estado

- [ ] **Componente ChecklistItemCard**
    - Para usar en vista de compra
    - Checkbox de comprado
    - Campos de precio, cantidad, lugar
    - Optimizado para móvil

- [ ] **Componente PurchaseHistoryTable**
    - Para detalle de producto
    - Mostrar historial de compras
    - Paginación del cliente

### Tipos TypeScript (Prioridad Media)

- [ ] Crear tipo `State`
- [ ] Crear tipo `Checklist` con relaciones
- [ ] Crear tipo `ChecklistItem` con relaciones
- [ ] Actualizar tipo `Product` (quitar price y stock)
- [ ] Crear tipo `PurchaseHistory` o `LastPurchase`

### Rutas (Alta Prioridad)

- [ ] Definir rutas para checklists
    - GET /dashboard/checklists - Listar
    - GET /dashboard/checklists/active - Ver activa
    - POST /dashboard/checklists - Crear
    - POST /dashboard/checklists/{id}/complete - Completar
    - POST /dashboard/checklists/{id}/cancel - Cancelar

- [ ] Definir rutas para items
    - POST /dashboard/checklists/{id}/items - Agregar producto
    - DELETE /dashboard/checklists/{id}/items/{product_id} - Quitar
    - PATCH /dashboard/checklist-items/{id}/mark-bought - Marcar comprado

- [x] Ruta para detalle de producto - Ya existe en resource routes
- [ ] Agregar método show() al resource de productos

### Navegación y UX (Prioridad Media)

- [ ] Actualizar menú principal
    - Despensa (productos)
    - Mi Lista (lista activa)
    - Historial (listas anteriores)

- [ ] Badge en menú "Mi Lista" con contador de items
- [ ] Breadcrumbs actualizados en todas las vistas
- [ ] Mensajes de éxito/error con toasts

### Validaciones (Prioridad Media)

- [ ] Validar que no se pueda crear lista si ya hay una abierta
- [ ] Validar que no se pueda modificar lista cerrada/cancelada
- [ ] Validar que precio sea numérico positivo
- [ ] Validar que cantidad sea numérica positiva

### Tests (Prioridad Baja - Futuro)

- [ ] Tests unitarios para lógica de última compra
- [ ] Tests de integración para flujo de checklist
- [ ] Tests de regla "solo una lista abierta"

### Mejoras Futuras (Backlog)

- [ ] Estadísticas de gasto por categoría
- [ ] Gráficas de evolución de precios
- [ ] Comparativa de precios entre lugares
- [ ] Sugerencias basadas en frecuencia de compra
- [ ] Exportar historial a Excel/PDF
- [ ] Notificaciones de productos no comprados en X tiempo

---

## Nuevas tareas

- Use this format to add new tasks

---

## Actualizado

- 2026-07-15
