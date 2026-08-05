import { Page } from '@playwright/test';

/**
 * Credentials default to the "Admin User" seeded by database/seeders/UserSeeder.php.
 * Override with E2E_EMAIL/E2E_PASSWORD env vars to run against a different user —
 * never hardcode real personal credentials here.
 */
const EMAIL = process.env.E2E_EMAIL ?? 'admin@example.com';
const PASSWORD = process.env.E2E_PASSWORD ?? 'admin123';

export async function login(page: Page) {
    await page.goto('/login');
    await page.getByLabel('Correo Electrónico').fill(EMAIL);
    await page.getByLabel('Contraseña').fill(PASSWORD);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await page.waitForURL('**/dashboard');
}
