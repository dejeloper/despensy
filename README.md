# 🛒 Despensy - Sistema de Gestión de Compras y Gastos

Sistema completo de gestión de compras, inventario y control de gastos desarrollado con Laravel + React + TypeScript + Inertia.js.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Características Principales](#-características-principales)
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

- **Backend**: Laravel 11.x (PHP 8.2+)
- **Frontend**: React 18 + TypeScript
- **Framework UI**: Inertia.js
- **Estilos**: TailwindCSS + shadcn/ui
- **Base de datos**: SQLite (desarrollo) / MySQL/PostgreSQL (producción)
- **Package Manager**: pnpm
- **Build Tool**: Vite
- **Testing**: Pest PHP

---

## ✨ Características Principales

### Módulos Implementados

1. **🗂️ Gestión de Categorías**
    - CRUD completo con personalización visual (íconos, colores)
    - Estado habilitado/deshabilitado
    - 38 categorías predefinidas

2. **📍 Gestión de Lugares**
    - Tiendas y establecimientos con colores personalizados
    - Direcciones y notas
    - 28 lugares predefinidos

3. **📏 Gestión de Unidades**
    - Unidades de medida (kg, litros, cajas, etc.)
    - 30+ unidades predefinidas

4. **📦 Gestión de Productos**
    - Relaciones con categorías, lugares y unidades
    - Control de stock y precios
    - Imágenes de productos
    - 100+ productos de ejemplo

5. **👥 Gestión de Consumidores**
    - Tipos: humano, mascota
    - Asociación con gastos

6. **✅ Sistema de Checklists**
    - Crear listas de compras desde productos
    - Carrito con cantidades
    - Estados: activo/completado
    - Filtrado por búsqueda y categoría

7. **✔️ Confirmación de Compras**
    - Confirmar qué se compró del checklist
    - Registrar precios, cantidades y lugares reales
    - Marcar productos como "no comprados"

8. **💰 Gestión de Gastos**
    - Registro detallado de compras
    - Validaciones con servicio dedicado

9. **🔐 Autenticación Completa**
    - Login/Logout
    - Recuperación de contraseña
    - Verificación de email
    - Perfil de usuario

10. **🎨 Sistema de Temas**
    - Modo claro/oscuro/sistema
    - Persistencia con cookies
    - Variables CSS personalizadas

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 18.x
- **pnpm** >= 8.x (o npm/yarn)
- **SQLite** (para desarrollo) o **MySQL/PostgreSQL** (para producción)

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

**Usuario de prueba creado:**

- Email: `admin@despensy.com`
- Password: `password`

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
php artisan test                       # Ejecutar tests con PHPUnit
./vendor/bin/pest                      # Ejecutar tests con Pest

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
pnpm run type-check     # Verificar tipos TypeScript
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
│   │   └── Requests/              # Form requests con validación
│   ├── Models/                    # Modelos Eloquent
│   │   └── business/
│   ├── Providers/                 # Service providers
│   └── Services/                  # Servicios de negocio
├── config/                        # Configuración de Laravel
├── database/
│   ├── factories/                 # Model factories
│   ├── migrations/                # Migraciones
│   └── seeders/                   # Seeders
├── public/                        # Punto de entrada web
│   └── build/                     # Assets compilados
├── resources/
│   ├── css/                       # Estilos globales
│   ├── js/                        # Código React + TypeScript
│   │   ├── components/            # Componentes reutilizables
│   │   ├── layouts/               # Layouts de página
│   │   ├── pages/                 # Páginas de Inertia
│   │   ├── structures/            # Definiciones de columnas
│   │   └── types/                 # Tipos TypeScript
│   └── views/                     # Vistas Blade (solo app.blade.php)
├── routes/
│   ├── web.php                    # Rutas web principales
│   ├── auth.php                   # Rutas de autenticación
│   ├── settings.php               # Rutas de configuración
│   └── api.php                    # Rutas API
├── storage/                       # Almacenamiento (logs, cache, uploads)
├── tests/                         # Tests (Pest PHP)
├── deploy.js                      # Script de deploy
├── deploy.config.json             # Configuración FTP
└── production/                    # Carpeta temporal de build
```

---

## 📦 Módulos Implementados

### 1. Categorías ([CategoryController.php](app/Http/Controllers/business/CategoryController.php))

**Funcionalidades:**

- CRUD completo
- Personalización visual (íconos emoji, colores de fondo y texto)
- Estado habilitado/deshabilitado
- Paginación

**Rutas:**

```
GET    /dashboard/categories         # Listar
GET    /dashboard/categories/create  # Formulario crear
POST   /dashboard/categories         # Guardar
GET    /dashboard/categories/{id}    # Ver
PUT    /dashboard/categories/{id}    # Actualizar
DELETE /dashboard/categories/{id}    # Eliminar
```

**Seeders:** 38 categorías predefinidas (Alimentos, Bebidas, Limpieza, Medicamentos, etc.)

---

### 2. Lugares ([PlaceController.php](app/Http/Controllers/business/PlaceController.php))

**Funcionalidades:**

- Gestión de tiendas y establecimientos
- Nombre corto, dirección, notas
- Colores personalizados (bg/text en hexadecimal)
- Validación de colores

**Rutas:**

```
GET    /dashboard/places
POST   /dashboard/places
PUT    /dashboard/places/{id}
DELETE /dashboard/places/{id}
```

**Seeders:** 28 lugares (Supermercados, farmacias, tiendas especializadas)

---

### 3. Unidades ([UnitController.php](app/Http/Controllers/business/UnitController.php))

**Funcionalidades:**

- Unidades de medida con nombre corto
- Estado habilitado/deshabilitado

**Rutas:**

```
GET    /dashboard/units
POST   /dashboard/units
PUT    /dashboard/units/{id}
DELETE /dashboard/units/{id}
```

**Seeders:** 30+ unidades (Kilogramo, Litro, Caja, Bulto, etc.)

---

### 4. Productos ([ProductController.php](app/Http/Controllers/business/ProductController.php))

**Funcionalidades:**

- Relaciones: Categoría, Lugar, Unidad
- Campos: nombre, descripción, imagen, precio, stock, cantidad máxima
- Validación completa

**Rutas:**

```
GET    /dashboard/products
POST   /dashboard/products
PUT    /dashboard/products/{id}
DELETE /dashboard/products/{id}
```

**Seeders:** 100+ productos de ejemplo

---

### 5. Consumidores ([ConsumerController.php](app/Http/Controllers/business/ConsumerController.php))

**Funcionalidades:**

- Tipos: `human`, `pet`
- Asociación con gastos

**Rutas:**

```
GET    /dashboard/consumers
POST   /dashboard/consumers
PUT    /dashboard/consumers/{id}
DELETE /dashboard/consumers/{id}
```

---

### 6. Checklists ([ChecklistController.php](app/Http/Controllers/business/ChecklistController.php))

**Funcionalidades:**

- Crear listas de compras desde productos
- Carrito con cantidades
- Filtrado por búsqueda y categoría
- Estados: `ACTIVE` / `COMPLETED`
- Servicio dedicado: [ChecklistService.php](app/Services/ChecklistService.php)

**Rutas:**

```
GET    /dashboard/checklists
GET    /dashboard/checklists/create
POST   /dashboard/checklists
GET    /dashboard/checklists/{id}
PUT    /dashboard/checklists/{id}
DELETE /dashboard/checklists/{id}
```

**Tablas:**

- `checklists`: Checklist principal
- `checklist_details`: Items del checklist

---

### 7. Confirmación de Compras ([ChecklistItemConfirmationController.php](app/Http/Controllers/business/ChecklistItemConfirmationController.php))

**Funcionalidades:**

- Confirmar productos comprados del checklist
- Registrar: cantidad real, precio unitario, lugar, unidad
- Marcar productos como "no comprados"
- Asociación con usuario que confirma

**Rutas:**

```
GET    /dashboard/checklists/{id}/confirm
POST   /dashboard/checklist-confirmations
PUT    /dashboard/checklist-confirmations/{id}/no-buy
```

---

### 8. Gastos ([ExpenseController.php](app/Http/Controllers/business/ExpenseController.php))

**Funcionalidades:**

- Registro de gastos con validaciones
- Servicio: [PurchaseValidationService.php](app/Services/PurchaseValidationService.php)
- Validaciones: producto habilitado, cantidad máxima, lugar sugerido

**Rutas:**

```
GET    /dashboard/expenses
POST   /dashboard/expenses
DELETE /dashboard/expenses/{id}
```

---

### 9. Autenticación ([routes/auth.php](routes/auth.php))

**Funcionalidades:**

- Login/Logout
- Registro (deshabilitado en rutas)
- Recuperación de contraseña
- Verificación de email
- Confirmación de contraseña

**Middleware:** `auth`, `verified`

---

### 10. Configuración ([routes/settings.php](routes/settings.php))

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
# Con Pest (recomendado)
./vendor/bin/pest

# Con PHPUnit
php artisan test

# Tests específicos
./vendor/bin/pest tests/Feature/Auth
./vendor/bin/pest tests/Unit/Models
```

### Tests Implementados

**Feature Tests:**

- ✅ Autenticación (login, registro, verificación email)
- ✅ Dashboard

**Unit Tests:**

- ✅ Modelos: Unit, Place
- ✅ Relaciones y factories

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

## 🔮 Roadmap / Mejoras Pendientes

- [ ] Dashboard con estadísticas y gráficas
- [ ] Historial completo de compras
- [ ] Reportes y análisis de gastos
- [ ] Exportación de datos (Excel/PDF)
- [ ] Automatizar desempaquetado en cPanel (API de hosting)
- [ ] API REST pública documentada
- [ ] Notificaciones push
- [ ] App móvil (React Native/Flutter)

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
