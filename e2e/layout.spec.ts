import { expect, test } from '@playwright/test';

test('permite reservar em tela estreita sem transbordamento horizontal', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/');
  await page.getByLabel('Responsável', { exact: true }).fill('ResponsávelComNomeMuitoLongoParaTestarAQuebraDeLinha');
  await page.getByLabel('Início', { exact: true }).fill('10:00');
  await page.getByLabel('Término', { exact: true }).fill('11:00');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();

  await expect(page.getByText('Reserva confirmada.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Cancelar reserva/ })).toBeVisible();
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true });

  await page.setViewportSize({ width: 1280, height: 800 });
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true });
});
