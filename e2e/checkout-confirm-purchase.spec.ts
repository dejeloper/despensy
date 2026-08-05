import { expect, test } from '@playwright/test';

import { login } from './support/auth';

/**
 * Flujo crítico: confirmar la compra de un producto pendiente en checkout.
 * Primero agrega un producto "fuera de lista" a la lista activa (desde
 * Despensa) para tener un item pendiente propio y no depender de datos
 * dejados por corridas anteriores contra la misma base de datos.
 */
test('a user can confirm the purchase of a pending item', async ({ page }) => {
    await login(page);

    // 1. Agregar un producto "fuera de lista" a la lista activa.
    await page.goto('/despensy');
    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: 'Fuera de lista' }).click();

    const firstRow = page.getByRole('row').nth(1);
    const productName = await firstRow.getByRole('cell').first().innerText();
    await firstRow.getByRole('button', { name: 'Ver / agregar a la lista' }).click();

    await page.getByLabel('¿Se va a comprar?').check();
    await page.getByPlaceholder('Cantidad').last().fill('2');
    await page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();

    // 2. Ir a checkout y elegir un lugar (el diálogo se abre solo al entrar).
    await page.goto('/despensy/checkout');
    await page.getByRole('combobox', { name: 'Selecciona un lugar' }).click();
    await page.getByRole('option').first().click();

    // 3. Completar y confirmar el item pendiente que se acaba de agregar.
    const pendingRow = page.locator('form').filter({ hasText: productName });
    await pendingRow.getByRole('combobox', { name: /unidad/i }).click();
    await page.getByRole('option').first().click();
    await pendingRow.getByPlaceholder('Precio total').fill('5000');
    await pendingRow.getByRole('button', { name: 'Confirmar compra' }).click();

    // 4. El item pasa a "Productos Confirmados".
    await expect(page.getByText(`Productos Confirmados`)).toBeVisible();
    await expect(page.getByText(productName).last()).toBeVisible();
});
