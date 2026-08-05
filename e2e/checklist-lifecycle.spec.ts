import { expect, test } from '@playwright/test';

import { login } from './support/auth';

/**
 * Flujo crítico: cerrar y cancelar la lista de compra activa desde Despensa.
 * Ambas acciones redirigen a /dashboard/checklists (historial) — se verifica
 * el toast de éxito en vez del badge, que ya no está en la página destino.
 */
test.describe('Checklist lifecycle', () => {
    test('a user can close the active checklist', async ({ page }) => {
        await login(page);
        await page.goto('/despensy');

        await page.getByRole('button', { name: 'Cerrar lista' }).click();

        await expect(page.getByText('Lista completada exitosamente.')).toBeVisible();
        await expect(page).toHaveURL(/\/dashboard\/checklists$/);
    });

    test('a user can cancel the active checklist', async ({ page }) => {
        await login(page);
        await page.goto('/despensy');

        page.once('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'Cancelar lista' }).click();

        await expect(page.getByText('Lista cancelada.')).toBeVisible();
        await expect(page).toHaveURL(/\/dashboard\/checklists$/);
    });
});
