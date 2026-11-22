import { expect, test } from '@playwright/test';

test('abre a agenda com salas disponíveis e a data preenchida', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('ReservaTurno');
  await expect(page.getByRole('heading', { name: 'Reservas', exact: true })).toBeVisible();
  await expect(page.getByLabel('Sala', { exact: true })).toHaveValue('sala-101');
  await expect(page.getByLabel('Data', { exact: true })).not.toHaveValue('');
  await expect(page.getByText('Nenhuma reserva para esta sala nesta data.')).toBeVisible();
});

test('cadastra uma reserva e exibe seus dados na agenda', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Sala', { exact: true }).selectOption('sala-102');
  await page.getByLabel('Data', { exact: true }).fill('2026-12-01');
  await page.getByLabel('Responsável', { exact: true }).fill('Maria Silva');
  await page.getByLabel('Início', { exact: true }).fill('09:30');
  await page.getByLabel('Término', { exact: true }).fill('10:30');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();

  await expect(page.getByText('Reserva confirmada.', { exact: true })).toBeVisible();
  await expect(page.getByText('09:30 – 10:30 · Maria Silva', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', {
    name: 'Cancelar reserva de Maria Silva às 09:30', exact: true,
  })).toBeVisible();
  await expect(page.getByLabel('Responsável', { exact: true })).toHaveValue('');
});
