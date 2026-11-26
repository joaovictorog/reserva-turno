import { expect, test } from '@playwright/test';
import { reservationsKey } from '../src/reservas/armazenamento';

for (const operation of ['removeItem', 'clear'] as const) {
  test(`sincroniza a agenda entre abas ao salvar e limpar reservas com ${operation}`, async ({ page, context }) => {
    const otherTab = await context.newPage();
    await page.goto('/');
    await otherTab.goto('/');
    await page.getByLabel('Data', { exact: true }).fill('2026-12-01');
    await otherTab.getByLabel('Data', { exact: true }).fill('2026-12-01');
    await page.getByLabel('Responsável', { exact: true }).fill('João');
    await page.getByLabel('Início', { exact: true }).fill('10:00');
    await page.getByLabel('Término', { exact: true }).fill('11:00');
    await page.getByRole('button', { name: 'Reservar', exact: true }).click();

    const reservation = otherTab.getByText('10:00 – 11:00 · João', { exact: true });
    await expect(reservation).toBeVisible();

    await page.evaluate(({ operation, key }) => {
      if (operation === 'clear') {
        localStorage.clear();
      } else {
        localStorage.removeItem(key);
      }
    }, { operation, key: reservationsKey });

    await expect(reservation).toHaveCount(0);
    await expect(otherTab.getByText('Nenhuma reserva para esta sala nesta data.')).toBeVisible();
  });
}

test('recupera uma reserva após recarregar a página', async ({ page }) => {
  await page.goto('/');
  const date = await page.getByLabel('Data', { exact: true }).inputValue();
  await page.getByLabel('Responsável', { exact: true }).fill('Maria Silva');
  await page.getByLabel('Início', { exact: true }).fill('14:00');
  await page.getByLabel('Término', { exact: true }).fill('15:00');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();
  await expect(page.getByText('Reserva confirmada.', { exact: true })).toBeVisible();

  await page.reload();
  await page.getByLabel('Data', { exact: true }).fill(date);
  await page.getByRole('button', { name: 'Consultar', exact: true }).click();

  await expect(page.getByText('14:00 – 15:00 · Maria Silva', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', {
    name: 'Cancelar reserva de Maria Silva às 14:00', exact: true,
  })).toHaveCount(1);
});

test('cancela uma reserva confirmada e libera o horário', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Data', { exact: true }).fill('2026-12-01');
  await page.getByLabel('Responsável', { exact: true }).fill('João');
  await page.getByLabel('Início', { exact: true }).fill('10:00');
  await page.getByLabel('Término', { exact: true }).fill('11:00');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();
  await expect(page.getByText('Reserva confirmada.', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Cancelar reserva de João às 10:00', exact: true }).click();
  const confirmation = page.getByRole('dialog', { name: 'Cancelar reserva?', exact: true });
  await expect(confirmation.getByText('Cancelar a reserva de João às 10:00?', { exact: true })).toBeVisible();
  await confirmation.getByRole('button', { name: 'Confirmar cancelamento', exact: true }).click();

  await expect(page.getByText('Reserva cancelada.', { exact: true })).toBeVisible();
  await expect(page.getByText('Nenhuma reserva para esta sala nesta data.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Cancelar reserva/ })).toHaveCount(0);

  await page.getByLabel('Responsável', { exact: true }).fill('Maria');
  await page.getByLabel('Início', { exact: true }).fill('10:00');
  await page.getByLabel('Término', { exact: true }).fill('11:00');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();

  await expect(page.getByText('Reserva confirmada.', { exact: true })).toBeVisible();
  await expect(page.getByText('10:00 – 11:00 · Maria', { exact: true })).toBeVisible();
});

test('mantém a reserva após desistir do cancelamento e recarregar', async ({ page }) => {
  const date = '2026-12-01';
  await page.goto('/');
  await page.getByLabel('Data', { exact: true }).fill(date);
  await page.getByLabel('Responsável', { exact: true }).fill('João');
  await page.getByLabel('Início', { exact: true }).fill('10:00');
  await page.getByLabel('Término', { exact: true }).fill('11:00');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();

  const reservation = page.getByText('10:00 – 11:00 · João', { exact: true });
  await expect(reservation).toBeVisible();

  await page.getByRole('button', { name: 'Cancelar reserva de João às 10:00', exact: true }).click();
  const confirmation = page.getByRole('dialog', { name: 'Cancelar reserva?', exact: true });
  await expect(confirmation.getByText('Cancelar a reserva de João às 10:00?', { exact: true })).toBeVisible();
  await confirmation.getByRole('button', { name: 'Manter reserva', exact: true }).click();
  await expect(confirmation).not.toBeVisible();
  await expect(reservation).toBeVisible();

  await page.reload();
  await page.getByLabel('Data', { exact: true }).fill(date);
  await page.getByRole('button', { name: 'Consultar', exact: true }).click();

  await expect(reservation).toBeVisible();
});

test('filtra a agenda por sala e data', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Data', { exact: true }).fill('2026-12-01');
  await page.getByLabel('Responsável', { exact: true }).fill('João');
  await page.getByLabel('Início', { exact: true }).fill('10:00');
  await page.getByLabel('Término', { exact: true }).fill('11:00');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();
  await expect(page.getByText('10:00 – 11:00 · João', { exact: true })).toBeVisible();

  await page.getByLabel('Sala', { exact: true }).selectOption('sala-102');
  await expect(page.getByText('Nenhuma reserva para esta sala nesta data.')).toBeVisible();
  await expect(page.getByText('10:00 – 11:00 · João', { exact: true })).toHaveCount(0);

  await page.getByLabel('Sala', { exact: true }).selectOption('sala-101');
  await expect(page.getByText('10:00 – 11:00 · João', { exact: true })).toBeVisible();

  await page.getByLabel('Data', { exact: true }).fill('2026-12-02');
  await expect(page.getByText('Nenhuma reserva para esta sala nesta data.')).toBeVisible();
  await expect(page.getByText('10:00 – 11:00 · João', { exact: true })).toHaveCount(0);

  await page.getByLabel('Data', { exact: true }).fill('2026-12-01');
  await expect(page.getByText('10:00 – 11:00 · João', { exact: true })).toBeVisible();
});

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

test('impede sobreposição e mantém a reserva original', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Data', { exact: true }).fill('2026-12-01');
  await page.getByLabel('Responsável', { exact: true }).fill('João');
  await page.getByLabel('Início', { exact: true }).fill('10:00');
  await page.getByLabel('Término', { exact: true }).fill('11:00');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();
  await expect(page.getByText('Reserva confirmada.', { exact: true })).toBeVisible();

  await page.getByLabel('Responsável', { exact: true }).fill('Maria');
  await page.getByLabel('Início', { exact: true }).fill('10:30');
  await page.getByLabel('Término', { exact: true }).fill('11:30');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();

  await expect(page.getByText('A sala já está reservada nesse horário.', { exact: true })).toBeVisible();
  const agenda = page.getByRole('region', { name: 'Agenda da sala', exact: true });
  await expect(agenda.getByRole('button', { name: /Cancelar reserva/ })).toHaveCount(1);
  await expect(agenda.getByText('10:00 – 11:00 · João', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Responsável', { exact: true })).toHaveValue('Maria');
});

test('consulta horários livre e ocupado sem alterar a agenda', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Data', { exact: true }).fill('2026-12-01');
  await page.getByLabel('Responsável', { exact: true }).fill('João');
  const startTime = page.getByLabel('Início', { exact: true });
  const endTime = page.getByLabel('Término', { exact: true });
  await startTime.fill('10:00');
  await endTime.fill('11:00');
  await page.getByRole('button', { name: 'Reservar', exact: true }).click();

  const agenda = page.getByRole('region', { name: 'Agenda da sala', exact: true });
  const reservation = agenda.getByText('10:00 – 11:00 · João', { exact: true });
  const cancelButtons = agenda.getByRole('button', { name: /Cancelar reserva/ });
  await expect(reservation).toBeVisible();
  await expect(cancelButtons).toHaveCount(1);

  const checkAvailability = page.getByRole('button', { name: 'Verificar disponibilidade', exact: true });
  await startTime.fill('11:00');
  await endTime.fill('12:00');
  await checkAvailability.click();

  await expect(page.getByText('Sala disponível neste horário.', { exact: true })).toBeVisible();
  await expect(reservation).toBeVisible();
  await expect(cancelButtons).toHaveCount(1);

  await startTime.fill('10:30');
  await endTime.fill('11:30');
  await checkAvailability.click();

  await expect(page.getByText('Sala indisponível neste horário.', { exact: true })).toBeVisible();
  await expect(reservation).toBeVisible();
  await expect(cancelButtons).toHaveCount(1);
});
