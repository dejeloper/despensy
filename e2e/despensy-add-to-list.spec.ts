import { expect, test } from '@playwright/test';

import { login } from './support/auth';

/**
 * Flujo crítico: agregar un producto a la lista de compra activa desde
 * Despensa. Usa el primer producto "Fuera de lista" del listado en vez de
 * uno fijo por nombre, para no depender de los datos exactos del seeder.
 */
test('a user can add a product to the active shopping list', async ({ page }) => {
    await login(page);

    await page.goto('/despensy');
    await expect(page.getByRole('heading', { name: 'Despensa' })).toBeVisible();

    // Asegura arrancar desde "Fuera de lista" para que la acción sea idempotente.
    // El select de Estado es el 2º combobox de la página (1º es Categoría) —
    // no muestra su placeholder como texto una vez que tiene un valor, así
    // que no se puede ubicar por texto visible.
    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: 'Fuera de lista' }).click();

    const firstRow = page.getByRole('row').nth(1);
    const productName = await firstRow.getByRole('cell').first().innerText();
    await firstRow.getByRole('button', { name: 'Ver / agregar a la lista' }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByLabel('¿Se va a comprar?').check();
    await page.getByPlaceholder('Cantidad').last().fill('2');
    await page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();

    await expect(page.getByRole('dialog')).toBeHidden();

    const updatedRow = page.getByRole('row').filter({ hasText: productName });
    await expect(updatedRow.getByText('En lista')).toBeVisible();
});
