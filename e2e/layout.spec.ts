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

test('aproveita uma tela desktop de 720 pixels sem rolagem da página vazia', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await expect(page.getByText('Nenhuma reserva para esta sala nesta data.')).toBeVisible();
  const mark = await page.locator('.brand-mark').boundingBox();
  const icon = await page.locator('.brand-mark svg').boundingBox();
  expect(Math.abs((mark!.x + mark!.width / 2) - (icon!.x + icon!.width / 2))).toBeLessThan(1);
  expect(Math.abs((mark!.y + mark!.height / 2) - (icon!.y + icon!.height / 2))).toBeLessThan(1);
  await expect(page.getByRole('button', { name: 'Verificar disponibilidade', exact: true })).toBeVisible();
  expect(await page.evaluate(() =>
    document.documentElement.scrollHeight <= window.innerHeight)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('desktop-empty.png'), fullPage: true });
});

test('modal de cancelamento mantém o foco e permite desistir pelo teclado', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByLabel('Responsável', { exact: true }).fill('Maria Silva');
  await page.getByLabel('Início', { exact: true }).fill('10:00');
  await page.getByLabel('Término', { exact: true }).fill('11:00');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();
  await expect(page.getByText('Sua reserva foi criada com sucesso.', { exact: true })).toBeVisible();

  const cancelButton = page.getByRole('button', { name: 'Cancelar reserva de Maria Silva às 10:00', exact: true });
  await cancelButton.click();
  const dialog = page.getByRole('dialog', { name: 'Cancelar reserva?', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Manter reserva', exact: true })).toBeFocused();
  await page.screenshot({ path: testInfo.outputPath('modal-desktop.png') });

  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Confirmar cancelamento', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Manter reserva', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Confirmar cancelamento', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(cancelButton).toBeFocused();

  await page.setViewportSize({ width: 320, height: 780 });
  await cancelButton.click();
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('modal-mobile.png'), fullPage: true });
  await dialog.getByRole('button', { name: 'Confirmar cancelamento', exact: true }).click();
  await expect(page.getByText('Cancelamento realizado com sucesso.', { exact: true })).toBeVisible();
});
