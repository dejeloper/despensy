/* eslint-disable no-undef */
import archiver from 'archiver';
import { Client } from 'basic-ftp';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import config from './deploy.config.json' with { type: 'json' };

const rootDir = process.cwd();
const prodDir = path.join(rootDir, 'production');

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
                const excludes = [
                    'node_modules',
                    '.github',
                    '.vscode',
                    'tests',
                    '.editorconfig',
                    '.env.example',
                    '.gitattributes',
                    '.gitignore',
                    '.prettierignore',
                    '.prettierrc',
                    'artisan',
                    'deploy.config.json',
                    'deploy.json',
                    'deploy.ts',
                    'eslint.config.js',
                    'phpunit.xml',
                    'tsconfig.json',
                    '.env',
                    '.git',
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

    // 5.

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

    // 7. Subir ZIP al FTP
    if (config.ftp?.host) {
        console.time('🌐 Subida FTP');
        markStart('🌐 Subida FTP');
        const files = listDirsRecursive(prodDir);
        console.log('📦 Archivos listos para subir:');
        files.forEach((f) => console.log(' - ' + f));

        const client = new Client();
        client.ftp.verbose = true;

        try {
            await client.access({
                host: config.ftp.host,
                user: config.ftp.user,
                password: config.ftp.password,
                secure: config.ftp.secure || false,
                secureOptions: { rejectUnauthorized: false },
                port: config.ftp.port || 21,
            });

            await client.ensureDir(config.ftp.remoteDir);
            await client.cd(config.ftp.remoteDir);
            await client.uploadFrom(zipPath, 'production.zip');
            console.log('✅ ZIP subido correctamente');
            console.log('⚡ Ahora entra a cPanel → Administrador de Archivos y extrae production.zip manualmente');
        } catch (err) {
            console.error('❌ Error en despliegue:', err);
        } finally {
            client.close();
        }
        console.timeEnd('🌐 Subida FTP');
        markEnd('🌐 Subida FTP');
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

function listDirsRecursive(dir, baseDir = dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((name) => {
        const fullPath = path.join(dir, name);
        const stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            const relative = path.relative(baseDir, fullPath);

            if (name === 'vendor') {
                const vendorList = fs
                    .readdirSync(fullPath)
                    .filter((sub) => fs.statSync(path.join(fullPath, sub)).isDirectory())
                    .map((sub) => path.join(relative, sub));
                results.push(...vendorList);
            } else {
                results.push(relative);
                results = results.concat(listDirsRecursive(fullPath, baseDir));
            }
        }
    });

    return results;
}
