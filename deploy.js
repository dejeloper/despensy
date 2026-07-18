/* eslint-disable no-undef */
import archiver from 'archiver';
import { Client } from 'basic-ftp';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import crypto from 'node:crypto';
import path from 'path';

const rootDir = process.cwd();
const prodDir = path.join(rootDir, 'production');

const ftp = loadFtpConfig(path.join(rootDir, '.env'));

const steps = [];

function markStart(label) {
    steps.push({
        label,
        startIso: new Date().toISOString(),
        startTs: Date.now(),
    });
}

function markEnd(label) {
    for (let i = steps.length - 1; i >= 0; i--) {
        if (steps[i].label === label && !steps[i].endIso) {
            steps[i].endIso = new Date().toISOString();
            steps[i].durationMs = Date.now() - steps[i].startTs;
            return;
        }
    }

    steps.push({
        label,
        startIso: new Date().toISOString(),
        startTs: Date.now(),
        endIso: new Date().toISOString(),
        durationMs: 0,
    });
}

async function main() {
    console.log('🚀 Iniciando build de producción...');
    console.time('⏱️ Tiempo total');
    markStart('⏱️ Tiempo total');

    // 1. Ejecutar comandos de build
    console.time('⚙️ Build');
    markStart('⚙️ Build');
    execSync('php artisan config:cache', { stdio: 'inherit' });
    execSync('php artisan cache:clear', { stdio: 'inherit' });
    execSync('php artisan route:cache', { stdio: 'inherit' });
    execSync('php artisan view:cache', { stdio: 'inherit' });
    execSync('php artisan optimize:clear', { stdio: 'inherit' });
    execSync('composer install --optimize-autoloader --no-dev', { stdio: 'inherit' });
    execSync('pnpm install', { stdio: 'inherit' });
    execSync('pnpm run build', { stdio: 'inherit' });
    console.timeEnd('⚙️ Build');
    markEnd('⚙️ Build');

    // 2. Borrar carpeta production si existe
    console.time('🧹 Preparando carpeta production');
    markStart('🧹 Preparando carpeta production');
    if (fs.existsSync(prodDir)) {
        fs.emptyDirSync(prodDir);
    } else {
        fs.mkdirSync(prodDir);
    }
    console.timeEnd('🧹 Preparando carpeta production');
    markEnd('🧹 Preparando carpeta production');

    // 3. Copiar todo excepto lo que no quieres
    console.time('📂 Copiando archivos');
    markStart('📂 Copiando archivos');
    for (const item of fs.readdirSync(rootDir)) {
        if (item === 'production') continue;
        const srcPath = path.join(rootDir, item);
        const destPath = path.join(prodDir, item);

        fs.copySync(srcPath, destPath, {
            filter: (src) => {
                const name = path.basename(src);
                // Toda la documentación queda fuera del paquete de producción,
                // incluidos los README dentro de vendor.
                if (name.endsWith('.md')) return false;
                const excludes = [
                    'node_modules',
                    '.agents',
                    '.claude',
                    '.github',
                    '.vscode',
                    'docs',
                    'tests',
                    '.editorconfig',
                    '.env.example',
                    '.gitattributes',
                    '.gitignore',
                    '.prettierignore',
                    '.prettierrc',
                    'artisan',
                    'deploy.config.json',
                    'deploy.js',
                    'deploy.json',
                    'deploy.token',
                    'deploy.ts',
                    'install.php',
                    'eslint.config.js',
                    'phpunit.xml',
                    'production.zip',
                    'tsconfig.json',
                    '.env',
                    '.git',
                    'database/migrations',
                    'database/seeders',
                    'database/factories',
                    'bootstrap/cache',
                ];
                return !excludes.includes(name);
            },
        });
    }
    console.timeEnd('📂 Copiando archivos');
    markEnd('📂 Copiando archivos');

    // 4. Validar y eliminar carpeta HOT
    console.time('📦 Ajustando public');
    markStart('📦 Ajustando public');
    const publicPath = path.join(prodDir, 'public');

    if (fs.existsSync(publicPath)) {
        ['HOT', 'hot'].forEach((hotName) => {
            const hotPath = path.join(publicPath, hotName);
            if (fs.existsSync(hotPath)) {
                fs.removeSync(hotPath);
                console.log(`ℹ️ Eliminado ${hotName} en public`);
            }
        });
    } else {
        console.warn('⚠️ public no existe en production, se omite este paso.');
    }

    console.timeEnd('📦 Ajustando public');
    markEnd('📦 Ajustando public');

    // 5. Renombrar .env.prod a .env
    console.time('🔑 Configurando .env');
    markStart('🔑 Configurando .env');
    const envProdPath = path.join(prodDir, '.env.prod');
    if (fs.existsSync(envProdPath)) {
        fs.renameSync(envProdPath, path.join(prodDir, '.env'));
    }
    console.timeEnd('🔑 Configurando .env');
    markEnd('🔑 Configurando .env');

    // 6. Crear ZIP de la carpeta production
    console.time('📦 Creando ZIP');
    markStart('📦 Creando ZIP');
    const zipPath = path.join(rootDir, 'production.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    await new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(output);
        archive.directory(prodDir, false);
        archive.finalize();
    });
    console.timeEnd('📦 Creando ZIP');
    markEnd('📦 Creando ZIP');

    console.log(`✅ ZIP creado (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(2)} MB)`);

    // 7. Generar token de un solo uso y escribir deploy.token
    console.time('🔐 Generando token');
    markStart('🔐 Generando token');
    const token = crypto.randomBytes(24).toString('hex');
    const tokenPath = path.join(rootDir, 'deploy.token');
    fs.writeFileSync(tokenPath, token, 'utf8');
    console.timeEnd('🔐 Generando token');
    markEnd('🔐 Generando token');

    // 8. Subir production.zip, install.php y deploy.token al FTP
    if (ftp.host) {
        console.time('🌐 Subida FTP');
        markStart('🌐 Subida FTP');

        const installerPath = path.join(rootDir, 'install.php');
        if (!fs.existsSync(installerPath)) {
            throw new Error('No se encontró install.php en la raíz del proyecto.');
        }

        const client = new Client();
        client.ftp.verbose = false;

        try {
            await client.access({
                host: ftp.host,
                user: ftp.user,
                password: ftp.password,
                secure: ftp.secure,
                secureOptions: { rejectUnauthorized: false },
                port: ftp.port,
            });

            // Raíz de la app (privada, fuera del navegador): production.zip + deploy.token
            await client.ensureDir(ftp.remoteDir);
            await client.uploadFrom(zipPath, 'production.zip');
            await client.uploadFrom(tokenPath, 'deploy.token');

            // Carpeta pública (Document Root): solo install.php, accesible por URL
            await client.ensureDir('public');
            await client.uploadFrom(installerPath, 'install.php');
            console.log('✅ production.zip y deploy.token en la raíz; install.php en public/');

            const installUrl = `${buildBaseUrl(ftp.host)}/install.php?token=${token}`;
            console.log('\n👉 Abre esta URL en el navegador para finalizar la instalación:\n');
            console.log(`   ${installUrl}\n`);
        } catch (err) {
            console.error('❌ Error en despliegue:', err);
        } finally {
            client.close();
        }

        // El token local ya no es necesario tras subirlo.
        fs.removeSync(tokenPath);

        console.timeEnd('🌐 Subida FTP');
        markEnd('🌐 Subida FTP');
    } else {
        console.warn('⚠️ Sin configuración FTP en .env (DEPLOY_FTP_HOST). Se omite la subida.');
        fs.removeSync(tokenPath);
    }

    markEnd('⏱️ Tiempo total');
    console.timeEnd('⏱️ Tiempo total');

    const summary = steps.map((s) => ({
        label: s.label,
        start: s.startIso,
        end: s.endIso || null,
        durationMs: s.durationMs ?? null,
        durationSec: s.durationMs != null ? (s.durationMs / 1000).toFixed(2) : null,
    }));

    console.log('\n📋 Resumen de pasos:');
    summary.forEach((s) => {
        console.log(` - ${s.label}: ${s.durationSec ?? '-'} s`);
    });
}

main();

function loadFtpConfig(envPath) {
    const env = parseEnvFile(envPath);

    return {
        host: env.DEPLOY_FTP_HOST || '',
        user: env.DEPLOY_FTP_USER || '',
        password: env.DEPLOY_FTP_PASSWORD || '',
        secure: String(env.DEPLOY_FTP_SECURE || '').toLowerCase() === 'true',
        port: Number(env.DEPLOY_FTP_PORT) || 21,
        remoteDir: env.DEPLOY_FTP_REMOTE_DIR || '/',
    };
}

function parseEnvFile(envPath) {
    const env = {};
    if (!fs.existsSync(envPath)) {
        return env;
    }

    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }

        const separator = trimmed.indexOf('=');
        if (separator === -1) {
            continue;
        }

        const key = trimmed.slice(0, separator).trim();
        let value = trimmed.slice(separator + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        env[key] = value;
    }

    return env;
}

function buildBaseUrl(host) {
    if (/^https?:\/\//i.test(host)) {
        return host.replace(/\/+$/, '');
    }

    return `https://${host.replace(/\/+$/, '')}`;
}
