# 🛒 Despensy

Herramienta personal para tomar mejores decisiones al momento de comprar productos de despensa: qué comprar, dónde y a qué precio, basándose en el historial real de compras.

**Stack**: Laravel 12 (PHP 8.2+) + Inertia.js 2 + React 19 + TypeScript + TailwindCSS 4 + shadcn/ui · SQLite (dev) / MySQL (prod) · pnpm + Vite · Pest.

Este README es solo la puerta de entrada: instalación y arranque en desarrollo. La documentación técnica vive en [`docs/`](docs/) — ver la tabla al final. Las reglas para asistentes de IA están en [`CLAUDE.md`](CLAUDE.md) y [`AI_RULES.md`](AI_RULES.md). El backlog de funcionalidad vive en [`planning.md`](planning.md).

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Instalación Local](#-instalación-local)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentación](#-documentación)
- [Licencia](#-licencia)

---

## 📋 Requisitos Previos

- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 18.x
- **pnpm** >= 8.x
- **SQLite** (desarrollo) o **MySQL** (producción/local con datos reales)

---

## 🔧 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/dejeloper/despensy.git
cd despensy

# 2. Instalar dependencias
composer install
pnpm install

# 3. Configurar entorno
cp .env.example .env
php artisan key:generate
```

Edita `.env` y configura la base de datos (por defecto SQLite; para MySQL ajusta `DB_CONNECTION` y credenciales):

```env
DB_CONNECTION=sqlite
```

```bash
# 4. Crear base de datos SQLite (solo desarrollo)
# Windows (PowerShell)
New-Item -Path database/database.sqlite -ItemType File -Force
# Linux/Mac
touch database/database.sqlite

# 5. Migrar y poblar con datos de ejemplo
php artisan migrate
php artisan db:seed

# 6. Enlazar storage
php artisan storage:link
```

### Levantar en desarrollo

```bash
# Terminal 1: servidor Laravel
php artisan serve

# Terminal 2: Vite con HMR
pnpm run dev
```

Abrir [http://localhost:8000](http://localhost:8000).

---

## 🧪 Testing

```bash
./vendor/bin/pest
```

---

## 🚀 Deployment

El despliegue está automatizado: ejecutar `node deploy.js` y abrir la URL que imprime. Ver [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) para prerrequisitos, el flujo completo y consideraciones de seguridad.

---

## 📚 Documentación

| Documento                                                      | Contenido                                                                          |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`CLAUDE.md`](CLAUDE.md)                                       | Índice completo de documentación para asistentes de IA.                            |
| [`AI_RULES.md`](AI_RULES.md)                                   | Reglas de comportamiento para IA.                                                  |
| [`docs/PROJECT.md`](docs/PROJECT.md)                           | Qué es y qué NO es Despensy.                                                       |
| [`docs/DOMAIN.md`](docs/DOMAIN.md)                             | Modelo de dominio (Product, Category, Place, Unit, Checklist, etc.).               |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)                 | Arquitectura, organización del proyecto y patrones de Controller/Service/Resource. |
| [`docs/BACKEND_CONVENTIONS.md`](docs/BACKEND_CONVENTIONS.md)   | Convenciones de PHP/Laravel.                                                       |
| [`docs/FRONTEND_CONVENTIONS.md`](docs/FRONTEND_CONVENTIONS.md) | Convenciones de React/TypeScript.                                                  |
| [`docs/DATABASE.md`](docs/DATABASE.md)                         | Migraciones y esquema de base de datos.                                            |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)                     | Mecanismo de despliegue (`deploy.js`, `install.php`).                              |
| [`planning.md`](planning.md)                                   | Backlog de funcionalidad.                                                          |

---

## 📄 Licencia

Proyecto privado — **Jhonatan**.
