# Despliegue de Despensy

Este documento describe **cómo** se despliega Despensy a producción: el flujo automatizado, las piezas que intervienen y las restricciones del hosting. Para la guía paso a paso orientada al operador (prerrequisitos, variables, ejemplo de salida) ver la sección "Deployment a Producción" del `README.md`; este documento es la referencia técnica del mecanismo.

El objetivo del diseño: reducir el despliegue a **dos acciones** — ejecutar `node deploy.js` y abrir la URL que imprime — sin usar el Administrador de Archivos de cPanel ni comandos por SSH.

## Piezas

| Pieza                | Rol                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `deploy.js`          | Corre en la máquina de desarrollo: compila, empaqueta, genera el token y sube por FTP.                          |
| `install.php`        | Corre en el servidor (una sola vez): valida, extrae, mueve el proyecto a su sitio y se auto-elimina.            |
| `deploy.token`       | Token aleatorio de un solo uso que autoriza la ejecución de `install.php`. Lo genera `deploy.js`.               |
| `production.zip`     | Paquete de producción con el proyecto ya compilado.                                                             |
| `.env` (`DEPLOY_FTP_*`) | Configuración FTP del despliegue. **No** hay un `deploy.config.json` — todo vive en `.env`.                  |

## Estructura del hosting (clave para entender el flujo)

El **Document Root** del subdominio apunta a la carpeta `public` de Laravel, y la cuenta FTP cae en la **raíz de la app** (el padre de `public`):

```
<DEPLOY_FTP_REMOTE_DIR>/            ← raíz de la app: donde cae el FTP y a donde se despliega el proyecto
    production.zip  deploy.token    ← privados: fuera del alcance del navegador
    app/ bootstrap/ config/ vendor/ ...
    public/                         ← Document Root: lo único que sirve el navegador
        install.php                 ← accesible como https://<dominio>/install.php
```

Consecuencia de diseño: cualquier archivo que deba abrirse por URL (el instalador) tiene que estar en `public/`; el ZIP y el token se dejan en la raíz, donde el navegador no llega. Por eso `deploy.js` sube a **dos** destinos distintos.

## Flujo de `deploy.js`

1. Build: un único `php artisan optimize:clear` (cubre config, route, view, cache, events y compiled — cachear antes serviría de nada, porque este mismo paso lo borraría), luego `composer install --no-dev --optimize-autoloader` y `pnpm install` en paralelo, y por último `pnpm run build`.
2. Copia selectiva a `production/` (en paralelo por cada item de la raíz). Se excluye todo lo que no corre en producción: `node_modules`, `tests`, `.git`, `.agents`, `.claude`, `docs`, `.github`, `.vscode`, la config de tooling, **todos los `.md`** (incluidos los README dentro de `vendor/`), y además `artisan`, `database/migrations`, `database/seeders` y `database/factories` — **en el hosting no se ejecuta ningún comando `artisan`** (ni `migrate` ni `seed`; los cambios de esquema se aplican por otra vía, fuera de este flujo), así que ni el binario ni esos directorios aportan nada al paquete. `bootstrap/cache` sí se copia (debe existir en el server) y viaja vacío de cachés de desarrollo gracias al `optimize:clear` del paso 1.
3. Renombra `.env.prod` → `.env` dentro del paquete y comprime en `production.zip`.
4. Genera un token con `crypto.randomBytes(24)` y lo escribe en `deploy.token`.
5. Sube por FTP:
    - Se conecta y navega a la raíz de la app (`DEPLOY_FTP_REMOTE_DIR`), luego llama a `client.clearWorkingDir()` — **borra todo el contenido remoto** (el despliegue anterior completo) antes de subir nada.
    - `production.zip` y `deploy.token` → raíz de la app.
    - `install.php` → subcarpeta `public/` (se recrea tras el borrado).

    **Por qué antes y no después (como hacía `install.php` originalmente):** el `public/.htaccess` que deja el despliegue anterior intercepta la request HTTP a `install.php` antes de que el servidor llegue a servir el archivo físico recién subido. Si la limpieza ocurre en `install.php` (después de subir), esa request nunca entra porque el `.htaccess` viejo ya está bloqueando. Limpiar por FTP antes de subir evita el problema.
6. Imprime la URL final: `https://<host>/install.php?token=<token>`. El token local se borra tras subirlo.

La config FTP se lee de `.env` (`DEPLOY_FTP_HOST`, `_USER`, `_PASSWORD`, `_SECURE`, `_PORT`, `_REMOTE_DIR`) mediante un parser propio — `deploy.js` no depende de `dotenv`.

## Flujo de `install.php`

Se ejecuta desde `public/`, así que obtiene la raíz real con `$root = dirname(__DIR__)` y construye todas las rutas a partir de ahí. Muestra una página HTML que revela cada paso con ~1s de pausa (solo presentación; el trabajo en PHP es inmediato). Ante un error se detiene mostrando el paso y la causa.

1. **Valida el token** contra `$root/deploy.token` con `hash_equals`. Si no coincide → HTTP 403.
2. **Validaciones**: existe `production.zip`, existe `ZipArchive`, la raíz es escribible, y el ZIP abre correctamente.
3. **Extrae** `production.zip` a `$root/production/` — ya no limpia nada antes: `deploy.js` dejó la raíz remota vacía (solo `production.zip`, `deploy.token` e `install.php`) antes de subir.
4. **Valida la estructura** del ZIP extraído (existen `app`, `bootstrap`, `config`, `public`, `vendor`).
5. **Mueve** todo de `$root/production/` a `$root/`, con `rename` (rápido) y fallback a copia recursiva con fusión cuando el destino ya existe.
6. **Recrea `public/storage`** apuntando a `storage/app/public` (equivale a `php artisan storage:link`).
7. **Limpieza y auto-eliminación**: elimina `production/`, `production.zip`, `deploy.token` y `install.php`. No queda ningún archivo de instalación en el servidor.

## Seguridad

- **Token de un solo uso**: aleatorio y criptográficamente seguro; se compara con `hash_equals` (resistente a timing). Tras un despliegue exitoso, `deploy.token` se elimina y `install.php` se auto-elimina, de modo que un segundo acceso a la URL responde 403.
- **Nada sensible queda expuesto**: `production.zip` y `deploy.token` viven fuera del Document Root; solo `install.php` es accesible y desaparece al terminar.

## Restricciones y advertencias

- **Config FTP en `.env`, no en JSON.** `DEPLOY_FTP_REMOTE_DIR` es la raíz de la app (donde cae el FTP); su subcarpeta `public/` es el Document Root.
- **No metas en rutas excluidas archivos que el runtime necesite.** El filtro de `deploy.js` descarta `.md`, `docs/`, `tests/`, config de tooling, etc. Si algo de eso hiciera falta en producción, ajusta el filtro; no asumas que llega al servidor.
- **La limpieza es destructiva y ahora ocurre en `deploy.js` (no en `install.php`).** `client.clearWorkingDir()` borra **todo** el contenido de la raíz remota antes de subir el nuevo paquete — cualquier archivo que exista en el servidor y no venga en `production.zip` se pierde, sin excepciones. En particular, si en producción se suben archivos a `storage/app/public` (o cualquier otra ruta) que no están en el repo, un `node deploy.js` los borra. Si en algún momento se necesita conservar algo así, hay que resolverlo antes de correr `deploy.js` (backup, exclusión explícita, etc.) — hoy no hay ninguna protección para eso.
- **Sin `artisan` en el server.** El paquete de producción no incluye el binario `artisan` ni `database/migrations`, `database/seeders` o `database/factories` — no se ejecuta ningún comando `artisan` en el hosting. Los cambios de esquema se aplican por otra vía, fuera de este flujo de deploy.
- **`symlink()` debe estar habilitado** en el hosting para el paso de `public/storage`; si estuviera deshabilitado, ese paso falla y detiene el despliegue.
