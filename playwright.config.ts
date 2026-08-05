import { defineConfig, devices } from '@playwright/test';

/**
 * Requiere el server de la app corriendo (`composer run dev`) antes de
 * ejecutar los tests — no se levanta automáticamente porque `composer run
 * dev` orquesta 3 procesos (artisan serve, queue:listen, vite) que Playwright
 * no puede manejar con su `webServer` de un solo comando.
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:8000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
