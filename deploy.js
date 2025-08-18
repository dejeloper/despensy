/* eslint-disable no-undef */
import archiver from 'archiver';
import { Client } from 'basic-ftp';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import config from './deploy.config.json' with { type: 'json' };

const rootDir = process.cwd();
const prodDir = path.join(rootDir, 'production');

async function main() {
    console.log('🚀 Iniciando build de producción...');

    // 1. Ejecutar comandos de build
    execSync('composer install --optimize-autoloader --no-dev', { stdio: 'inherit' });
    execSync('pnpm install', { stdio: 'inherit' });
    execSync('pnpm run build', { stdio: 'inherit' });
    execSync('php artisan config:cache', { stdio: 'inherit' });
    execSync('php artisan route:cache', { stdio: 'inherit' });
    execSync('php artisan view:cache', { stdio: 'inherit' });

    // 2. Borrar carpeta production si existe
    if (fs.existsSync(prodDir)) {
        console.log('🧹 Limpiando contenido de production...');
        fs.emptyDirSync(prodDir); // Borra contenido, mantiene la carpeta
    } else {
        fs.mkdirSync(prodDir);
        console.log('📂 Creada carpeta production');
    }

    console.log('📂 Copiando archivos a production...');

    // 3. Copiar todo excepto lo que no quieres
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
                    'deploy.config.json',
                    'deploy.json',
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

    // 4. Mover contenido de public al root de production
    const publicPath = path.join(prodDir, 'public');
    fs.copySync(publicPath, prodDir);
    fs.removeSync(publicPath);

    // 5. Editar index.php
    const indexPath = path.join(prodDir, 'index.php');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    indexContent = indexContent.replace(`$root = __DIR__ . '/..';`, `$root = __DIR__;`);
    fs.writeFileSync(indexPath, indexContent);

    // 6. Renombrar .env.prod a .env
    const envProdPath = path.join(prodDir, '.env.prod');
    if (fs.existsSync(envProdPath)) {
        fs.renameSync(envProdPath, path.join(prodDir, '.env'));
    }

    console.log('✅ Production listo en carpeta /production');

    // 7. Crear ZIP de la carpeta production
    const zipPath = path.join(rootDir, 'production.zip');
    console.log(`📦 Creando ZIP en ${zipPath}...`);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    await new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(output);
        archive.directory(prodDir, false); // mete toda la carpeta "production"
        archive.finalize();
    });

    console.log(`✅ ZIP creado (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(2)} MB)`);

    // 8. Subir ZIP al FTP
    if (config.ftp?.host) {
        console.log('📦 Archivos listos para subir:');
        const files = listDirsRecursive(prodDir);
        files.forEach((f) => console.log(' - ' + f));

        console.log('🌐 Conectando al FTP...');

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

            console.log(`⬆️ Subiendo ZIP a ${config.ftp.remoteDir}/production.zip`);
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
    }
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
                // solo mostrar primer nivel de vendor
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
