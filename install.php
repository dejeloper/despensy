<?php

/**
 * Despensy — Instalador de despliegue (un solo uso)
 *
 * Estructura del hosting (Document Root = .../public):
 *
 *   /home/dejeloper/despensy.dejeloper.com/       ← raíz de la app ($root, destino final)
 *       production.zip  deploy.token              ← privados (fuera del navegador)
 *       app/ bootstrap/ config/ vendor/ ...
 *       public/                                   ← Document Root
 *           install.php                           ← accesible como /install.php
 *
 * deploy.js sube production.zip, deploy.token y este install.php dentro de
 * public/. La limpieza del despliegue anterior se hace aparte, fuera de este
 * flujo. Como el instalador vive en public/, obtiene la raíz real con
 * dirname(__DIR__) y construye todas las rutas a partir de ahí.
 *
 * Flujo:
 *   1. Valida el token (comparación segura con $root/deploy.token).
 *   2. Verifica requisitos (ZipArchive, permisos, ZIP válido).
 *   3. Extrae $root/production.zip a $root/production/.
 *   4. Valida que el ZIP contenga un proyecto Laravel real.
 *   5. Fusiona todo de $root/production/ a $root/ (re-despliegue = merge).
 *   6. Elimina production/, production.zip, deploy.token y este archivo.
 *
 * Nota: este instalador NO toca public/storage. El hosting no soporta
 * symlink() (función deshabilitada), así que ese paso quedó fuera a
 * propósito; ver docs/DEPLOYMENT.md.
 */

declare(strict_types=1);

// ── Blindaje contra fatales mudos ───────────────────────────
// Un error fatal (memoria, timeout de php-fpm, etc.) ocurre FUERA de los
// try/catch y de fail(), y en producción produce un 500 en blanco. Este
// shutdown handler lo convierte en un mensaje legible con archivo y línea.
error_reporting(E_ALL);
@ini_set('log_errors', '1');
@ini_set('display_errors', '0'); // ponlo en '1' solo mientras depuras

register_shutdown_function(function () {
    $e = error_get_last();
    if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: text/plain; charset=utf-8');
        }
        echo "FATAL: {$e['message']}\n en {$e['file']}:{$e['line']}\n";
    }
});

set_time_limit(0);
ignore_user_abort(true);

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');

$root = dirname(__DIR__);
$zipFile = $root . '/production.zip';
$tokenFile = $root . '/deploy.token';
$extractDir = $root . '/production';
$installer = __FILE__;

$requiredDirs = ['app', 'bootstrap', 'config', 'public', 'vendor'];

/** @var array<int, array{status: string, label: string, detail: string}> $steps */
$steps = [];

// ── 1. Validar el token ─────────────────────────────────────
$providedToken = trim((string) ($_GET['token'] ?? ''));
$expectedToken = is_file($tokenFile) ? trim((string) file_get_contents($tokenFile)) : '';

if ($expectedToken === '' || !hash_equals($expectedToken, $providedToken)) {
    unauthorized();
}

addStep('Token validado');

// ── 2. Validaciones iniciales ───────────────────────────────
if (!is_file($zipFile)) {
    fail('production.zip encontrado', 'No se encontró production.zip en la raíz de la app.');
}

addStep('production.zip encontrado');

if (!class_exists('ZipArchive')) {
    fail('Requisitos verificados', 'La extensión ZipArchive de PHP no está habilitada.');
}

if (!is_writable($root)) {
    fail('Requisitos verificados', 'La raíz de la app no tiene permisos de escritura.');
}

// Abrir el ZIP ahora: si estuviera corrupto, mejor detenerse antes de limpiar
// el directorio, para no dejar el sitio vacío.
$zip = new ZipArchive();
$opened = $zip->open($zipFile);
if ($opened !== true) {
    fail('Requisitos verificados', 'No se pudo abrir el ZIP (código ' . $opened . ').');
}

addStep('Requisitos verificados');

// ── 3. Extraer el ZIP ───────────────────────────────────────
if (!$zip->extractTo($extractDir)) {
    $zip->close();
    fail('ZIP extraído correctamente', 'La extracción del ZIP falló.');
}
$zip->close();

if (!is_dir($extractDir)) {
    fail('ZIP extraído correctamente', 'La carpeta production/ no se generó tras la extracción.');
}

addStep('ZIP extraído correctamente');

// ── 4. Validar el contenido extraído ────────────────────────
foreach ($requiredDirs as $dir) {
    if (!is_dir($extractDir . '/' . $dir)) {
        fail('Estructura del proyecto verificada', "El ZIP no contiene la carpeta requerida: {$dir}/.");
    }
}

addStep('Estructura del proyecto verificada');

// ── 5. Fusionar el proyecto en la raíz de la app ────────────
$items = array_diff(scandir($extractDir) ?: [], ['.', '..']);
foreach ($items as $item) {
    $src = $extractDir . '/' . $item;
    $dst = $root . '/' . $item;

    if (!moveItem($src, $dst)) {
        fail('Archivos movidos a la raíz de la app', "No se pudo mover: {$item}");
    }
}

addStep('Archivos movidos a la raíz de la app');

// ── 6. Limpieza y auto-eliminación ──────────────────────────
removeDirectory($extractDir);
@unlink($zipFile);
@unlink($tokenFile);
@unlink($installer);

addStep('Archivos temporales eliminados');
addStep('Instalación completada correctamente');

renderPage(true);

// ── Helpers ─────────────────────────────────────────────────

function addStep(string $label, string $detail = ''): void
{
    global $steps;
    $steps[] = ['status' => 'ok', 'label' => $label, 'detail' => $detail];
}

function fail(string $label, string $reason): never
{
    global $steps;
    $steps[] = ['status' => 'fail', 'label' => $label, 'detail' => $reason];
    renderPage(false);
}

function moveItem(string $src, string $dst): bool
{
    global $installer;

    // Preferir rename: es un simple cambio de puntero, mucho más rápido que copiar.
    // En re-despliegue el destino ya existe, así que rename falla y caemos al
    // merge recursivo de abajo.
    if (@rename($src, $dst)) {
        return true;
    }

    // Fallback (destino existente): fusión recursiva.
    if (is_dir($src)) {
        if (!is_dir($dst) && !mkdir($dst, 0775, true)) {
            return false;
        }

        foreach (array_diff(scandir($src) ?: [], ['.', '..']) as $item) {
            $childSrc = $src . '/' . $item;
            $childDst = $dst . '/' . $item;

            // CLAVE: no sobrescribir el instalador que se está ejecutando ahora
            // mismo. Si lo pisáramos/borráramos a media ejecución, PHP puede
            // reventar con un fatal → 500 en blanco en la segunda pasada.
            // Descartamos la copia del ZIP y conservamos el vivo; se autoelimina
            // al final en el paso 7.
            if (@realpath($childDst) === @realpath($installer)) {
                @unlink($childSrc);
                continue;
            }

            if (!moveItem($childSrc, $childDst)) {
                return false;
            }
        }

        return @rmdir($src);
    }

    // Archivo suelto cuyo destino ya existe: sobrescribir.
    if (!@copy($src, $dst)) {
        return false;
    }

    return @unlink($src);
}

function removeDirectory(string $dir): void
{
    if (!is_dir($dir)) {
        return;
    }

    foreach (array_diff(scandir($dir) ?: [], ['.', '..']) as $item) {
        $path = $dir . '/' . $item;
        is_dir($path) ? removeDirectory($path) : @unlink($path);
    }

    @rmdir($dir);
}

function unauthorized(): never
{
    http_response_code(403);
    header('Content-Type: text/html; charset=utf-8');
    echo pageShell(
        '🔒 Despliegue no autorizado',
        '<p class="lead">El token proporcionado no es válido o el despliegue ya se completó.</p>'
    );
    exit;
}

function renderPage(bool $success): never
{
    global $steps;

    http_response_code($success ? 200 : 500);
    header('Content-Type: text/html; charset=utf-8');

    $total = count($steps);
    $rows = '';
    foreach ($steps as $i => $step) {
        $ok = $step['status'] === 'ok';
        $icon = $ok ? '✔' : '✖';
        $detail = $step['detail'] !== ''
            ? '<span class="detail">' . htmlspecialchars($step['detail'], ENT_QUOTES) . '</span>'
            : '';

        $rows .= sprintf(
            '<li class="step %s" data-status="%s"><span class="count">%d/%d</span><span class="icon">%s</span><span class="label">%s</span>%s</li>',
            $ok ? 'ok' : 'fail',
            $ok ? 'ok' : 'fail',
            $i + 1,
            $total,
            $icon,
            htmlspecialchars($step['label'], ENT_QUOTES),
            $detail
        );
    }

    $heading = $success
        ? '<p class="lead ok">🎉 Despliegue completado correctamente.</p><a class="cta" href="/">Ir a Despensy</a>'
        : '<p class="lead fail">El despliegue se detuvo. Revisa el paso marcado y vuelve a ejecutar <code>node deploy.js</code>.</p>';

    $body = '<ul class="steps">' . $rows . '</ul><div class="heading">' . $heading . '</div>';

    echo pageShell('🚀 Despliegue de Despensy', $body);
    exit;
}

function pageShell(string $title, string $body): string
{
    $safeTitle = htmlspecialchars($title, ENT_QUOTES);

    return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>{$safeTitle}</title>
    <script>document.documentElement.className += ' js-reveal';</script>
    <style>
        :root { color-scheme: light dark; }
        * { box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; margin: 0; padding: 1.5rem;
            background: #0f172a; color: #e2e8f0;
        }
        .card {
            width: 100%; max-width: 460px;
            background: #1e293b; border: 1px solid #334155;
            border-radius: 16px; padding: 2rem 1.75rem;
            box-shadow: 0 20px 40px -12px rgba(0,0,0,.5);
        }
        h1 { margin: 0 0 1.25rem; font-size: 1.35rem; line-height: 1.3; }
        .steps { list-style: none; margin: 0 0 1.25rem; padding: 0; }
        .steps li {
            display: grid; grid-template-columns: auto 1.25rem 1fr; align-items: baseline;
            gap: .25rem .55rem; padding: .55rem 0; border-bottom: 1px solid #273449;
        }
        .steps li:last-child { border-bottom: 0; }
        /* Con JS activo, cada paso se revela en secuencia (~1s). Sin JS se ven todos. */
        html.js-reveal .steps li:not(.shown),
        html.js-reveal .heading:not(.shown) { display: none; }
        .step, .heading { animation: fade .3s ease both; }
        @keyframes fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .count { color: #64748b; font-size: .78rem; font-variant-numeric: tabular-nums; }
        .icon { font-weight: 700; }
        .steps li.ok .icon { color: #34d399; }
        .steps li.fail .icon { color: #f87171; }
        .label { font-weight: 500; }
        .detail {
            grid-column: 3; font-size: .85rem; color: #f87171; margin-top: .2rem;
        }
        .lead { margin: .5rem 0 1rem; color: #94a3b8; font-size: .95rem; }
        .lead.ok { color: #34d399; font-weight: 600; }
        .lead.fail { color: #fca5a5; }
        code { background: #0f172a; padding: .1rem .35rem; border-radius: 6px; font-size: .85em; }
        .cta {
            display: inline-block; background: #3b82f6; color: #fff;
            text-decoration: none; padding: .6rem 1.4rem; border-radius: 10px;
            font-weight: 600; transition: background .15s ease;
        }
        .cta:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="card">
        <h1>{$safeTitle}</h1>
        {$body}
    </div>
    <script>
        (function () {
            var STEP_DELAY = 1000;
            var steps = Array.prototype.slice.call(document.querySelectorAll('.steps .step'));
            var heading = document.querySelector('.heading');
            var index = 0;

            function revealHeading() {
                if (heading) heading.classList.add('shown');
            }

            function revealNext() {
                if (index >= steps.length) {
                    revealHeading();
                    return;
                }

                var step = steps[index++];
                step.classList.add('shown');

                // Ante un error, detenerse de inmediato mostrando el mensaje.
                if (step.dataset.status === 'fail') {
                    revealHeading();
                    return;
                }

                // Pausa visual solo entre pasos exitosos.
                if (index < steps.length && steps[index].dataset.status === 'fail') {
                    revealNext();
                } else {
                    setTimeout(revealNext, STEP_DELAY);
                }
            }

            revealNext();
        })();
    </script>
</body>
</html>
HTML;
}
