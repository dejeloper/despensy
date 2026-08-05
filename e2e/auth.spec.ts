import { expect, test } from '@playwright/test';

import { login } from './support/auth';

test.describe('Login', () => {
    test('a user can log in and lands on the dashboard', async ({ page }) => {
        await login(page);

        await expect(page).toHaveURL(/\/dashboard$/);
        await expect(page.getByText('Lista de compra')).toBeVisible();
    });

    test('shows a validation error with wrong credentials', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Correo Electrónico').fill('admin@example.com');
        await page.getByLabel('Contraseña').fill('wrong-password');
        await page.getByRole('button', { name: 'Iniciar sesión' }).click();

        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByText(/credenciales|these credentials/i)).toBeVisible();
    });
});
