import { expect, test } from '@playwright/test';

test('abre a agenda com salas disponíveis e a data preenchida', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('ReservaTurno');
  await expect(page.getByRole('heading', { name: 'Reservas', exact: true })).toBeVisible();
  await expect(page.getByLabel('Sala', { exact: true })).toHaveValue('sala-101');
  await expect(page.getByLabel('Data', { exact: true })).not.toHaveValue('');
  await expect(page.getByText('Nenhuma reserva para esta sala nesta data.')).toBeVisible();
});
