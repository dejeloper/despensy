# Despliegue de Despensy

Este documento describe **cómo** se despliega Despensy a producción: el flujo automatizado, las piezas que intervienen y las restricciones del hosting. Para la guía paso a paso orientada al operador (prerrequisitos, variables, ejemplo de salida) ver la sección "Deployment" del `README.md`; este documento es la referencia técnica del mecanismo.

El objetivo del diseño: reducir el despliegue a **dos acciones** — ejecutar `node deploy.js` y abrir la URL que imprime — sin usar el Administrador de Archivos de cPanel ni comandos por SSH.

## Piezas

| Pieza                   | Rol                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `deploy.js`             | Corre en la máquina de desarrollo: compila, empaqueta, limpia el remoto y sube por FTP.              |
| `install.php`           | Corre en el servidor (una sola vez): valida, extrae, mueve el proyecto a su sitio y se auto-elimina. |
| `deploy.token`          | Token aleatorio de un solo uso que autoriza la ejecución de `install.php`. Lo genera `deploy.js`.    |
| `production.zip`        | Paquete de producción con el proyecto ya compilado.                                                  |
| `.env` (`DEPLOY_FTP_*`) | Configuración FTP del despliegue. **No** hay un `deploy.config.json` — todo vive en `.env`.          |

## Estructura del hosting (clave para entender el flujo)

El **Document Root** del subdominio apunta a la carpeta `public` de Laravel, y la cuenta FTP cae en la **raíz de la app** (el padre de `public`):

```
<DEPLOY_FTP_REMOTE_DIR>/            ← raíz de la app: donde cae el FTP y a donde se despliega el proyecto
    production.zip deploy.token     ← privados: fuera del alcance del navegador
    app/ bootstrap/ config/ vendor/ ...
    public/                         ← Document Root: lo único que sirve el navegador
        install.php                 ← accesible como https://<dominio>/install.php
```

Consecuencia de diseño: cualquier archivo que deba abrirse por URL (el instalador) tiene que estar en `public/`; el ZIP y el token se dejan en la raíz, donde el navegador no llega. Por eso `deploy.js` sube a **dos** destinos distintos.

## Flujo de `deploy.js`

1. Build: un único `php artisan optimize:clear` (cubre config, route, view, cache, events y compiled — cachear antes no serviría de nada, porque este mismo paso lo borraría), luego `composer install --no-dev --optimize-autoloader` y `pnpm install` en paralelo, y por último `pnpm run build`.
2. Copia selectiva a `production/` (en paralelo por cada item de la raíz). Se excluye todo lo que no corre en producción: `node_modules`, `tests`, `.git`, `.agents`, `.claude`, `docs`, `.github`, `.vscode`, la config de tooling, **todos los `.md`** (incluidos los README dentro de `vendor/`), y además `artisan`, `database/migrations`, `database/seeders` y `database/factories` — **en el hosting no se ejecuta ningún comando `artisan`** (ni `migrate` ni `seed`; los cambios de esquema se aplican por otra vía, fuera de este flujo), así que ni el binario ni esos directorios aportan nada al paquete. `bootstrap/cache` sí se copia (debe existir en el server) y viaja vacío de cachés de desarrollo gracias al `optimize:clear` del paso 1.
3. Renombra `.env.prod` → `.env` dentro del paquete y comprime en `production.zip`.
4. Genera un token con `crypto.randomBytes(24)` y lo escribe en `deploy.token`.
5. Sube por FTP:
    - Se conecta y navega a la raíz de la app (`DEPLOY_FTP_REMOTE_DIR`).
    - Sube `public/.htaccess` (en blanco) para **neutralizar** el `.htaccess` que dejó el despliegue anterior — no se borra el resto del remoto.
    - `production.zip` y `deploy.token` → raíz de la app.
    - `install.php` → subcarpeta `public/`.

    **Por qué neutralizar y no borrar todo por FTP:** se probó llamar a `client.clearWorkingDir()` antes de subir, pero el remoto ya tiene un Laravel completo desplegado (incluido `vendor/`, con miles de archivos) porque `install.php` lo extrae del lado del servidor, no vía FTP. Borrar eso recursivamente por FTP implica miles de comandos `DELE`/`RMD` uno por uno; en este hosting compartido eso tarda tanto que el socket de control se cae a medio camino (`ECONNRESET`). Por eso `deploy.js` no borra nada por FTP: solo neutraliza el `.htaccess` que bloqueaba la request a `install.php`, y deja que `install.php` haga el reemplazo del lado del servidor (disco local, rápido) al fusionar `production/` sobre la raíz.

6. Imprime la URL final: `https://<host>/install.php?token=<token>`. El token local se borra tras subirlo.

Cualquier error durante la conexión o subida por FTP se relanza y termina el proceso con código de salida distinto de cero — un fallo de despliegue nunca se reporta como éxito.

La config FTP se lee de `.env` (`DEPLOY_FTP_HOST`, `_USER`, `_PASSWORD`, `_SECURE`, `_PORT`, `_REMOTE_DIR`) mediante un parser propio — `deploy.js` no depende de `dotenv`.

## Flujo de `install.php`

Se ejecuta desde `public/`, así que obtiene la raíz real con `$root = dirname(__DIR__)` y construye todas las rutas a partir de ahí. Muestra una página HTML que revela cada paso con ~1s de pausa (solo presentación; el trabajo en PHP es inmediato). Ante un error se detiene mostrando el paso y la causa.

1. **Valida el token** contra `$root/deploy.token` con `hash_equals`. Si no coincide → HTTP 403.
2. **Validaciones**: existe `production.zip`, existe `ZipArchive`, la raíz es escribible, y el ZIP abre correctamente.
3. **Extrae** `production.zip` a `$root/production/` — ya no limpia nada antes: `deploy.js` dejó la raíz remota vacía (solo `production.zip`, `deploy.token` e `install.php`) antes de subir.
4. **Valida la estructura** del ZIP extraído (existen `app`, `bootstrap`, `config`, `public`, `vendor`).
5. **Mueve** todo de `$root/production/` a `$root/`, con `rename` (rápido) y fallback a copia recursiva con fusión cuando el destino ya existe.
6. **Limpieza y auto-eliminación**: elimina `production/`, `production.zip`, `deploy.token` y `install.php`. No queda ningún archivo de instalación en el servidor.

`install.php` **no** toca `public/storage`. El hosting real de Despensy tiene `symlink()` deshabilitada (no es un problema de permisos: la función no existe en ese entorno), y como tampoco hay `artisan` en el server, no hay forma de reproducir `storage:link` ahí. Si en algún momento se necesita servir archivos desde el disco `public`, hay que resolverlo aparte (subir directo a `public/` por otro medio, cambiar de disco, o gestionar el enlace manualmente si el hosting cambia).

## Seguridad

- **Token de un solo uso**: aleatorio y criptográficamente seguro; se compara con `hash_equals` (resistente a timing). Tras un despliegue exitoso, `deploy.token` se elimina y `install.php` se auto-elimina, de modo que un segundo acceso a la URL responde 403.
- **Nada sensible queda expuesto**: `production.zip` y `deploy.token` viven fuera del Document Root; solo `install.php` es accesible y desaparece al terminar.

## Restricciones y advertencias

- **Config FTP en `.env`, no en JSON.** `DEPLOY_FTP_REMOTE_DIR` es la raíz de la app (donde cae el FTP); su subcarpeta `public/` es el Document Root.
- **No metas en rutas excluidas archivos que el runtime necesite.** El filtro de `deploy.js` descarta `.md`, `docs/`, `tests/`, config de tooling, etc. Si algo de eso hiciera falta en producción, ajusta el filtro; no asumas que llega al servidor.
- **No hay borrado masivo del remoto — ni por FTP ni en `install.php`.** El despliegue es un _merge_: `install.php` fusiona `production/` sobre la raíz existente (`rename`, con fallback a copia recursiva), sobrescribiendo lo que coincide pero sin tocar lo que no viene en el ZIP. Consecuencia: un archivo que quede huérfano en el server (porque se quitó del repo, o porque se subió manualmente fuera del flujo, p. ej. a `storage/app/public`) **sobrevive** a futuros despliegues indefinidamente — nada lo limpia. Si algún día hace falta purgar el remoto, hay que hacerlo a mano (FTP/cPanel), sabiendo que un `clearWorkingDir()` vía FTP no es viable en este hosting por el volumen de archivos (ver arriba, `ECONNRESET`).
- **Sin `artisan` en el server.** El paquete de producción no incluye el binario `artisan` ni `database/migrations`, `database/seeders` o `database/factories` — no se ejecuta ningún comando `artisan` en el hosting. Los cambios de esquema se aplican por otra vía, fuera de este flujo de deploy.
- **`symlink()` no está disponible en el hosting actual.** `install.php` no intenta crear `public/storage`; no lo agregues sin antes confirmar que `function_exists('symlink')` es `true` en el server, porque llamar a una función inexistente en PHP lanza un `Error` fatal (no un warning) que no queda contenido por el manejo de errores del instalador.
