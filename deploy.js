/* eslint-disable no-undef */
import archiver from 'archiver';
import { Client } from 'basic-ftp';
import { spawn } from 'child_process';
import fs from 'fs-extra';
import crypto from 'node:crypto';
import path from 'path';

const rootDir = process.cwd();
const prodDir = path.join(rootDir, 'production');
const ftp = loadFtpConfig(path.join(rootDir, '.env'));

const ZIP_LEVEL = Number(process.env.DEPLOY_ZIP_LEVEL) || 6;

class Spinner {
    constructor(text = '🔧 Trabajando') {
        this.text = text;
        this.frames = ['', '.', '..', '...', '....'];
        this.i = 0;
        this.timer = null;
        this.active = false;
        this.tty = Boolean(process.stdout.isTTY);
    }

    start() {
        if (this.active) return;
        this.active = true;
        this.render();
        this.timer = setInterval(() => {
            this.i = (this.i + 1) % this.frames.length;
            this.render();
        }, 1000);
        if (this.timer.unref) this.timer.unref();
    }

    render() {
        if (!this.active || !this.tty) return;
        process.stdout.write(`\r\x1b[K${this.text}${this.frames[this.i]}`);
    }

    log(...args) {
        if (this.tty && this.active) process.stdout.write('\r\x1b[K');
        console.log(...args);
        this.render();
    }

    stop() {
        if (!this.active) return;
        this.active = false;
        clearInterval(this.timer);
        this.timer = null;
        if (this.tty) process.stdout.write('\r\x1b[K');
    }
}

const spinner = new Spinner('🔧 Trabajando');

const steps = [];

function markStart(label) {
    steps.push({ label, startIso: new Date().toISOString(), startTs: Date.now() });
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

function run(cmd) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, { cwd: rootDir, shell: true });
        const forward = (buf) => {
            buf.toString()
                .split(/\r?\n/)
                .forEach((line) => {
                    if (line.trim() !== '') spinner.log(line);
                });
        };
        child.stdout.on('data', forward);
        child.stderr.on('data', forward);
        child.on('error', reject);
        child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Comando falló (código ${code}): ${cmd}`));
        });
    });
}

const EXCLUDE_NAMES = new Set([
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
]);

//
const EXCLUDE_PATHS = new Set(['database/migrations', 'database/seeders', 'database/factories']);

function shouldExclude(src) {
    const name = path.basename(src);
    if (name.endsWith('.md')) return true;
    if (EXCLUDE_NAMES.has(name)) return true;

    const rel = path.relative(rootDir, src).split(path.sep).join('/');
    for (const p of EXCLUDE_PATHS) {
        if (rel === p || rel.startsWith(p + '/')) return true;
    }
    return false;
}

async function main() {
    spinner.start();
    spinner.log('🚀 Iniciando build de producción...');
    markStart('⏱️ Tiempo total');

    markStart('⚙️ Build');
    await run('php artisan optimize:clear');

    await Promise.all([run('composer install --optimize-autoloader --no-dev'), run('pnpm install')]);

    await run('pnpm run build');
    markEnd('⚙️ Build');

    markStart('🧹 Preparando carpeta production');
    await fs.emptyDir(prodDir);
    markEnd('🧹 Preparando carpeta production');

    markStart('📂 Copiando archivos');
    const items = fs.readdirSync(rootDir).filter((item) => item !== 'production');
    await Promise.all(
        items.map((item) =>
            fs.copy(path.join(rootDir, item), path.join(prodDir, item), {
                filter: (src) => !shouldExclude(src),
            }),
        ),
    );
    markEnd('📂 Copiando archivos');

    markStart('📦 Ajustando public');
    const publicPath = path.join(prodDir, 'public');
    if (fs.existsSync(publicPath)) {
        for (const hotName of ['HOT', 'hot']) {
            const hotPath = path.join(publicPath, hotName);
            if (fs.existsSync(hotPath)) {
                await fs.remove(hotPath);
                spinner.log(`ℹ️ Eliminado ${hotName} en public`);
            }
        }
    } else {
        spinner.log('⚠️ public no existe en production, se omite este paso.');
    }
    markEnd('📦 Ajustando public');

    markStart('🔑 Configurando .env');
    const envProdPath = path.join(prodDir, '.env.prod');
    if (fs.existsSync(envProdPath)) {
        await fs.rename(envProdPath, path.join(prodDir, '.env'));
    }
    markEnd('🔑 Configurando .env');

    markStart('📦 Creando ZIP');
    const zipPath = path.join(rootDir, 'production.zip');
    await new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: ZIP_LEVEL } });
        output.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(output);
        archive.directory(prodDir, false);
        archive.finalize();
    });
    markEnd('📦 Creando ZIP');
    spinner.log(`✅ ZIP creado (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(2)} MB)`);

    markStart('🔐 Generando token');
    const token = crypto.randomBytes(24).toString('hex');
    const tokenPath = path.join(rootDir, 'deploy.token');
    await fs.writeFile(tokenPath, token, 'utf8');
    markEnd('🔐 Generando token');

    if (ftp.host) {
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

            await client.ensureDir(ftp.remoteDir);
            const blankHtaccessPath = path.join(rootDir, 'public/.htaccess');
            try {
                await client.uploadFrom(blankHtaccessPath, 'public/.htaccess');
                spinner.log('🧹 public/.htaccess neutralizado (bloqueaba install.php)');
            } catch (err) {
                spinner.log(`⚠️ No se pudo neutralizar public/.htaccess: ${err?.message || err}`);
            }

            await client.uploadFrom(zipPath, 'production.zip');
            await client.uploadFrom(tokenPath, 'deploy.token');

            await client.ensureDir('public');
            await client.uploadFrom(installerPath, 'install.php');
            spinner.log('✅ production.zip y deploy.token en la raíz; install.php en public/');

            const installUrl = `${buildBaseUrl(ftp.host)}/install.php?token=${token}`;
            spinner.log('\n👉 Abre esta URL en el navegador para finalizar la instalación:\n');
            spinner.log(`   ${installUrl}\n`);
        } catch (err) {
            throw new Error(`Error en despliegue FTP: ${err?.message || err}`);
        } finally {
            client.close();
            await fs.remove(tokenPath);
            markEnd('🌐 Subida FTP');
        }
    } else {
        spinner.log('⚠️ Sin configuración FTP en .env (DEPLOY_FTP_HOST). Se omite la subida.');
        await fs.remove(tokenPath);
    }

    markEnd('⏱️ Tiempo total');
}

main()
    .catch((err) => {
        spinner.stop();
        console.error(`\n❌ Falló el build: ${err?.message || err}`);
        process.exitCode = 1;
    })
    .finally(() => {
        spinner.stop();

        const summary = steps.map((s) => ({
            label: s.label,
            durationSec: s.durationMs != null ? (s.durationMs / 1000).toFixed(2) : null,
        }));

        console.log('\n📋 Resumen de pasos:');
        summary.forEach((s) => {
            console.log(` - ${s.label}: ${s.durationSec ?? '-'} s`);
        });
    });

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
    if (!fs.existsSync(envPath)) return env;

    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const separator = trimmed.indexOf('=');
        if (separator === -1) continue;

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
