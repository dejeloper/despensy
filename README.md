# 🛒 Despensy

Herramienta personal para tomar mejores decisiones al momento de comprar productos de despensa: qué comprar, dónde y a qué precio, basándose en el historial real de compras. Construida con Laravel + React + TypeScript + Inertia.js.

> Para las decisiones de arquitectura, convenciones y reglas del proyecto, la fuente de verdad es [`CLAUDE.md`](CLAUDE.md), [`AI_RULES.md`](AI_RULES.md) y los documentos en [`docs/`](docs/) — este README cubre solo instalación y operación. El backlog de funcionalidad vive en [`planning.md`](planning.md).

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Local](#-instalación-local)
- [Scripts Disponibles](#-scripts-disponibles)
- [Deployment a Producción](#-deployment-a-producción)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos Implementados](#-módulos-implementados)
- [Testing](#-testing)
- [Configuración](#-configuración)

---

## 🚀 Stack Tecnológico

- **Backend**: Laravel 12.x (PHP 8.2+)
- **Frontend**: React 19 + TypeScript
- **Framework UI**: Inertia.js 2
- **Estilos**: TailwindCSS 4 + shadcn/ui (Radix)
- **Base de datos**: SQLite (desarrollo/tests) / MySQL (producción/local)
- **Package Manager**: pnpm
- **Build Tool**: Vite
- **Testing**: Pest PHP

---

## ✅ Estado del Proyecto

Lo que ya está construido y funcionando:

1. **🗂️ Categorías** — CRUD completo, personalización visual (íconos, colores).
2. **📍 Lugares** — CRUD completo, tiendas/establecimientos con colores y notas.
3. **📏 Unidades** — CRUD completo, unidades de medida con nombre corto.
4. **📦 Productos** — CRUD completo. Un producto es catálogo (nombre, descripción, imagen, categoría) — **no tiene precio ni stock propios**; esos datos se derivan de la última compra registrada en `checklist_items` (`ProductLastPurchaseService`) y se muestran en el listado (`last_price`, `last_place_name`, `last_unit_name`, `last_purchase_date`).
5. **✅ Listas de compra (Checklist)** — crear una lista (`ChecklistLifecycleService`, cierra automáticamente cualquier lista abierta previa del mismo usuario), agregar/quitar productos, marcar como comprado con precio/lugar/unidad reales (`ChecklistItemService`), completar o cancelar. Una lista cerrada o cancelada es inmutable. Historial de listas anteriores con detalle de lo comprado.
6. **🔐 Autenticación completa** — login/logout, recuperación de contraseña, verificación de email, perfil de usuario.
7. **🎨 Sistema de temas** — modo claro/oscuro/sistema, persistencia con cookies.

No existen (a pesar de builds/documentación anteriores que los mencionaban): gestión de consumidores, confirmación de compras como módulo separado, ni gestión de gastos. Si se retoman, entran primero por `planning.md`.

La UI de Checklist es funcional pero mínima (sin pulir): `<select>`/Combobox básicos, sin toasts (usa los mismos mensajes flash `success`/`error` que el resto de la app). Ver `planning.md` para lo que sigue.

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 18.x
- **pnpm** >= 8.x (o npm/yarn)
- **SQLite** (para desarrollo) o **MySQL** (para producción/local con datos reales)

---

## 🔧 Instalación Local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd despensy
```

### 2. Instalar dependencias de PHP

```bash
composer install
```

### 3. Instalar dependencias de JavaScript

```bash
pnpm install
```

### 4. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Generar key de aplicación
php artisan key:generate
```

### 5. Configurar base de datos

Edita el archivo `.env` y configura tu base de datos:

**Para desarrollo (SQLite):**

```env
DB_CONNECTION=sqlite
# Comenta las siguientes líneas
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=despensy
# DB_USERNAME=root
# DB_PASSWORD=
```

**Para producción (MySQL):**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=despensy
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 6. Crear base de datos SQLite (solo para desarrollo)

```bash
# Windows (PowerShell)
New-Item -Path database/database.sqlite -ItemType File -Force

# Linux/Mac
touch database/database.sqlite
```

### 7. Ejecutar migraciones y seeders

```bash
# Migrar base de datos
php artisan migrate

# Poblar con datos de ejemplo (opcional pero recomendado)
php artisan db:seed
```

### 8. Crear enlace simbólico para storage

```bash
php artisan storage:link
```

### 9. Levantar el proyecto

**Opción 1: Servidores separados**

```bash
# Terminal 1: Servidor Laravel
php artisan serve

# Terminal 2: Servidor Vite (desarrollo)
pnpm run dev
```

Abrir navegador en: http://localhost:8000

**Opción 2: Solo servidor Laravel (producción local)**

```bash
# Compilar assets
pnpm run build

# Levantar servidor
php artisan serve
```

---

## 📜 Scripts Disponibles

### Scripts de PHP (Artisan)

```bash
# Limpiar todas las cachés
php artisan optimize:clear

# Cachear configuración (producción)
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migraciones
php artisan migrate                    # Ejecutar migraciones
php artisan migrate:fresh --seed       # Recrear BD con seeders
php artisan migrate:rollback           # Revertir última migración

# Seeders
php artisan db:seed                    # Ejecutar todos los seeders
php artisan db:seed --class=UserSeeder # Ejecutar seeder específico

# Testing
./vendor/bin/pest                      # Ejecutar tests con Pest

# Formato de código PHP
./vendor/bin/pint                      # Aplicar estilo (PSR-12 + reglas Laravel)

# Desarrollo
php artisan serve                      # Servidor de desarrollo
php artisan tinker                     # REPL interactivo
```

### Scripts de JavaScript (pnpm)

```bash
pnpm install            # Instalar dependencias
pnpm run dev            # Servidor de desarrollo con HMR
pnpm run build          # Compilar para producción
pnpm run lint           # Ejecutar linter (ESLint)
pnpm run format         # Aplicar formato (Prettier)
pnpm run types          # Verificar tipos TypeScript (tsc --noEmit)
```

### Script de Deploy

```bash
# Ejecutar deploy completo
node deploy.js
```

---

## 🚀 Deployment a Producción

### Prerrequisitos

1. **Configurar archivo `.env.prod`** en la raíz del proyecto:

```env
APP_NAME=Despensy
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tudominio.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=tu_base_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

# ... resto de configuraciones de producción
```

2. **Configurar FTP en `deploy.config.json`**:

```json
{
    "ftp": {
        "host": "ftp.tudominio.com",
        "user": "tu_usuario",
        "password": "tu_contraseña",
        "port": 21,
        "secure": false,
        "remoteDir": "/public_html"
    }
}
```

### Proceso de Deploy

#### 1. Ejecutar script de deploy

```bash
node deploy.js
```

**Este script realiza:**

- ✅ Cacheo de configuración y optimización
- ✅ Instalación de dependencias de producción
- ✅ Build de assets con Vite
- ✅ Copia selectiva de archivos (excluye tests, node_modules, etc.)
- ✅ Renombra `.env.prod` a `.env`
- ✅ Crea archivo `production.zip`
- ✅ Sube el ZIP al servidor FTP

#### 2. Desempaquetar en cPanel (Proceso Manual)

> ⚠️ **Nota**: Este paso es manual y debe automatizarse en el futuro.

1. Acceder a **cPanel** de tu hosting
2. Ir a **Administrador de Archivos**
3. Navegar a la carpeta donde se subió `production.zip` (ej: `/public_html`)
4. Hacer clic derecho sobre `production.zip` → **Extraer**
5. Confirmar la extracción
6. Eliminar `production.zip` después de extraer

#### 3. Configuración post-deploy en el servidor

Conectarse al servidor por SSH y ejecutar:

```bash
cd /ruta/a/tu/proyecto

# Generar key de aplicación (solo la primera vez)
php artisan key:generate

# Ejecutar migraciones
php artisan migrate --force

# Cachear configuración
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Crear enlace simbólico de storage (solo la primera vez)
php artisan storage:link

# Ajustar permisos
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 4. Verificar funcionamiento

Abrir navegador en `https://tudominio.com` y verificar que todo funcione correctamente.

---

## 📁 Estructura del Proyecto

```
despensy/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/              # Controladores de autenticación
│   │   │   ├── Shared/            # Controladores compartidos (emojis)
│   │   │   └── business/          # Controladores de negocio
│   │   ├── Middleware/            # Middleware personalizado
│   │   ├── Requests/              # Form requests con validación
│   │   └── Resources/             # API Resources (transforman modelos para el frontend)
│   ├── Models/                    # Modelos Eloquent
│   │   └── business/
│   ├── Providers/                 # Service providers
│   └── Services/                  # Servicios de negocio
│       └── business/
├── config/                        # Configuración de Laravel
├── database/
│   ├── factories/                 # Model factories
│   ├── migrations/                # Migraciones
│   └── seeders/                   # Seeders
├── docs/                          # Documentación de arquitectura, dominio y convenciones
├── public/                        # Punto de entrada web
│   └── build/                     # Assets compilados
├── resources/
│   ├── css/                       # Estilos globales
│   ├── js/                        # Código React + TypeScript
│   │   ├── components/            # Componentes reutilizables
│   │   ├── hooks/                 # Hooks reutilizables
│   │   ├── layouts/               # Layouts de página
│   │   ├── pages/                 # Páginas de Inertia
│   │   ├── structures/            # Definiciones de columnas de tabla
│   │   └── types/                 # Tipos TypeScript
│   └── views/                     # Vistas Blade (solo app.blade.php)
├── routes/
│   ├── web.php                    # Rutas web principales
│   ├── auth.php                   # Rutas de autenticación
│   ├── settings.php               # Rutas de configuración
│   └── api.php                    # Rutas API
├── storage/                       # Almacenamiento (logs, cache, uploads)
├── tests/                         # Tests (Pest PHP)
├── CLAUDE.md                      # Índice de documentación para asistentes de IA
├── AI_RULES.md                    # Reglas operativas para asistentes de IA
├── planning.md                    # Backlog de funcionalidad
├── deploy.js                      # Script de deploy
└── deploy.config.json             # Configuración FTP
```

---

## 📦 Módulos Implementados

Los cuatro módulos de catálogo (Categorías, Lugares, Unidades, Productos) siguen el mismo patrón de rutas: `Route::resource(...)->except(['show'])` dentro de `Route::prefix('dashboard')->middleware(['auth', 'verified'])`, es decir `index`, `create`, `store`, `edit`, `update`, `destroy` — sin vista de detalle (`show`) para ninguno de los cuatro.

### 1. Categorías ([CategoryController.php](app/Http/Controllers/business/CategoryController.php))

**Funcionalidades:**

- CRUD completo
- Personalización visual (íconos emoji, colores de fondo y texto)
- Estado habilitado/deshabilitado
- Búsqueda y paginación del lado del cliente

**Seeders:** 49 categorías predefinidas

---

### 2. Lugares ([PlaceController.php](app/Http/Controllers/business/PlaceController.php))

**Funcionalidades:**

- Gestión de tiendas y establecimientos
- Nombre corto, dirección, notas
- Colores personalizados (bg/text en hexadecimal)

**Seeders:** 17 lugares (supermercados, tiendas especializadas)

---

### 3. Unidades ([UnitController.php](app/Http/Controllers/business/UnitController.php))

**Funcionalidades:**

- Unidades de medida con nombre corto

**Seeders:** 21 unidades (Kilogramo, Litro, Caja, Docena, etc.)

---

### 4. Productos ([ProductController.php](app/Http/Controllers/business/ProductController.php))

**Funcionalidades:**

- Relación: Categoría (única relación propia del producto — lugar y unidad son de cada compra, no del producto, ver [`docs/DOMAIN.md`](docs/DOMAIN.md))
- Campos propios: nombre, descripción, imagen, categoría, estado
- Campos derivados de la última compra (calculados por `ProductLastPurchaseService`, no almacenados en `products`): `last_price`, `last_place_name`, `last_unit_name`, `last_purchase_date`

**Seeders:** 182 productos de ejemplo

---

### 5. Listas de compra ([ChecklistController.php](app/Http/Controllers/business/ChecklistController.php), [ChecklistItemController.php](app/Http/Controllers/business/ChecklistItemController.php))

**Funcionalidades:**

- Un usuario tiene a lo sumo una lista abierta a la vez — crear una nueva cierra automáticamente la anterior (`ChecklistLifecycleService`)
- Agregar/quitar productos de la lista, marcar como comprado con cantidad/unidad/lugar/precio reales, deshacer (`ChecklistItemService`)
- Completar o cancelar una lista; una lista `Cerrada`/`Cancelada` es inmutable (lanza `ChecklistNotEditableException` si se intenta modificar)
- Historial de listas anteriores con detalle de lo comprado y total gastado

**Rutas:** `checklists.{index,active,show,store,complete,cancel}`, `checklist-items.{store,destroy,mark-bought,mark-not-bought}` — ver `routes/web.php`

---

### 6. Autenticación ([routes/auth.php](routes/auth.php))

**Funcionalidades:**

- Login/Logout
- Recuperación de contraseña
- Verificación de email
- Confirmación de contraseña

**Middleware:** `auth`, `verified`

---

### 7. Configuración ([routes/settings.php](routes/settings.php))

**Funcionalidades:**

- Perfil de usuario
- Cambio de contraseña
- Apariencia (tema claro/oscuro)
- Eliminación de cuenta

**Rutas:**

```
GET    /settings/profile
PATCH  /settings/profile
DELETE /settings/profile
PUT    /settings/password
GET    /settings/appearance
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
./vendor/bin/pest

# Tests específicos
./vendor/bin/pest tests/Feature/Auth
./vendor/bin/pest tests/Unit/Models
```

### Tests Implementados

**Feature Tests:**

- ✅ Autenticación (login, registro, verificación de email, recuperación de contraseña)
- ✅ Dashboard, Configuración (perfil, contraseña)
- ✅ Controladores de negocio: Categorías, Lugares, Unidades, Productos (CRUD + validación + reglas de integridad)
- ✅ Checklist y ChecklistItem: ciclo de vida completo, autorización entre usuarios, inmutabilidad de listas cerradas

**Unit Tests:**

- ✅ Modelos: `User`, `Category`, `Place`, `Product`, `Unit`, `State`, `Checklist`, `ChecklistItem` — relaciones, scopes y factories
- ✅ Services: `ProductLastPurchaseService`, `ChecklistLifecycleService`, `ChecklistItemService`

---

## ⚙️ Configuración

### Variables de Entorno Importantes

```env
# Aplicación
APP_NAME=Despensy
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de datos
DB_CONNECTION=sqlite

# Cache (producción)
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

# Mail (opcional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
```

### Middleware Personalizado

- **HandleAppearance**: Gestión de tema visual (claro/oscuro)
- **HandleInertiaRequests**: Compartir datos globales (user, flash messages)

### API Externa

**Emoji API** ([EmojiController.php](app/Http/Controllers/Shared/EmojiController.php))

- Endpoint: `/api/emojis`
- Búsqueda y filtrado por categoría
- Caché de 1 hora

---

## 🎨 Características de UI/UX

### Componentes Reutilizables

- **DataTable**: Tablas con acciones y paginación
- **DataCards**: Vista móvil adaptativa
- **Pagination**: Paginación completa
- **Breadcrumbs**: Navegación contextual
- **Loading**: Estados de carga

### Sistema de Temas

- Modo claro/oscuro/sistema
- Cookie persistente `appearance`
- Detección automática de preferencias
- Variables CSS personalizadas

---

## 🔮 Roadmap

El backlog completo y priorizado vive en [`planning.md`](planning.md). Resumen de lo más próximo:

- Pulir la UI de Checklist (Combobox en vez de `<select>`, toasts, historial más detallado)
- Vista de "Despensa" con indicador de producto en lista activa y botón rápido +/− para agregar/quitar desde el listado
- Vista de detalle de producto con historial de compras

---

## 📄 Licencia

Este proyecto es privado.

---

## 👤 Autor

**Jhonatan**

---

## 🤝 Contribuir

Si deseas contribuir al proyecto:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Soporte

Si encuentras algún bug o tienes alguna sugerencia, abre un issue en el repositorio.

---

**¡Gracias por usar Despensy!** 🛒✨
