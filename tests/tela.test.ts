// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadReservations, saveReservations } from '../src/reservas/armazenamento';
import { createReservation } from '../src/reservas/reserva';
import { getLocalDate } from '../src/reservas/data';

const input = {
  roomId: 'sala-101',
  date: '2026-12-01',
  owner: 'João',
  startMinute: 600,
  endMinute: 660,
};

function consult(date = input.date) {
  document.querySelector<HTMLInputElement>('#date-filter')!.value = date;
  document.querySelector<HTMLFormElement>('#filters')!
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function book() {
  document.querySelector<HTMLInputElement>('#date-filter')!.value = input.date;
  document.querySelector<HTMLInputElement>('[name="owner"]')!.value = input.owner;
  document.querySelector<HTMLInputElement>('[name="startTime"]')!.value = '10:00';
  document.querySelector<HTMLInputElement>('[name="endTime"]')!.value = '11:00';
  document.querySelector<HTMLFormElement>('#booking-form')!
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function editBookingField(name: string, value: string) {
  const field = document.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  vi.resetModules();
  localStorage.clear();
  document.body.innerHTML = `
    <form id="filters">
      <select id="room-filter"></select>
      <input type="date" id="date-filter">
    </form>
    <p id="agenda-status"></p>
    <div id="reservation-list"></div>
    <form id="booking-form">
      <input name="owner">
      <input name="startTime" type="time">
      <input name="endTime" type="time">
      <button type="button" id="check-availability">Verificar disponibilidade</button>
    </form>
    <p id="booking-status"></p>
  `;
  await import('../src/main');
});

describe('disponibilidade na tela', () => {
  function checkAvailability(startTime = '10:00', endTime = '11:00') {
    document.querySelector<HTMLInputElement>('#date-filter')!.value = input.date;
    document.querySelector<HTMLInputElement>('[name="startTime"]')!.value = startTime;
    document.querySelector<HTMLInputElement>('[name="endTime"]')!.value = endTime;
    document.querySelector<HTMLButtonElement>('#check-availability')!.click();
  }

  it('consulta disponibilidade sem exigir o nome do responsável ou criar reserva', () => {
    checkAvailability();
    expect(document.querySelector('#booking-status')!.textContent).toBe('Sala disponível neste horário.');
    expect(loadReservations(localStorage)).toEqual([]);
  });

  it('informa quando o horário está ocupado', () => {
    saveReservations(localStorage, [createReservation(input)]);
    checkAvailability();
    expect(document.querySelector('#booking-status')!.textContent).toBe('Sala indisponível neste horário.');
  });

  it('limpa o resultado de disponibilidade ao editar o início', () => {
    checkAvailability();
    const status = document.querySelector('#booking-status')!;
    expect(status.textContent).toBe('Sala disponível neste horário.');

    editBookingField('startTime', '10:30');

    expect(status.textContent).toBe('');
  });

  it('informa intervalo invertido', () => {
    checkAvailability('11:00', '10:00');
    expect(document.querySelector('#booking-status')!.textContent)
      .toContain('Informe uma data e um intervalo');
  });

  it('solicita horários quando os campos estão vazios', () => {
    checkAvailability('', '');
    expect(document.querySelector('#booking-status')!.textContent)
      .toContain('Não foi possível verificar');
  });
});

describe('cadastro na tela', () => {
  it('limpa a confirmação ao editar o responsável', () => {
    book();
    const status = document.querySelector('#booking-status')!;
    expect(status.textContent).toBe('Reserva confirmada.');

    editBookingField('owner', 'Maria');

    expect(status.textContent).toBe('');
    expect(document.querySelector('#reservation-list')!.textContent).toContain('João');
  });

  it('limpa o erro de conflito ao editar o término', () => {
    saveReservations(localStorage, [createReservation(input)]);
    book();
    const status = document.querySelector('#booking-status')!;
    expect(status.textContent).toContain('já está reservada');

    editBookingField('endTime', '11:30');

    expect(status.textContent).toBe('');
  });

  it('salva a reserva e atualiza a agenda exibida', () => {
    book();
    expect(loadReservations(localStorage)).toEqual([
      { ...input, id: expect.any(String) },
    ]);
    expect(document.querySelector('#booking-status')!.textContent).toBe('Reserva confirmada.');
    expect(document.querySelector('#reservation-list')!.textContent).toContain('João');
    expect(document.querySelector<HTMLInputElement>('[name="owner"]')!.value).toBe('');
  });

  it('mantém os campos preenchidos quando há conflito', () => {
    saveReservations(localStorage, [createReservation(input)]);
    book();
    expect(document.querySelector('#booking-status')!.textContent).toContain('já está reservada');
    expect(document.querySelector<HTMLInputElement>('[name="owner"]')!.value).toBe('João');
    expect(loadReservations(localStorage)).toHaveLength(1);
  });

  it('informa falhas inesperadas de persistência', () => {
    const failure = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw 'Falha';
    });
    try {
      book();
      expect(document.querySelector('#booking-status')!.textContent)
        .toBe('Não foi possível salvar a reserva.');
    } finally {
      failure.mockRestore();
    }
  });
});

describe('cancelamento na tela', () => {
  it('identifica a reserva antes de confirmar o cancelamento', () => {
    book();

    document.querySelector<HTMLButtonElement>('#reservation-list button')!.click();

    expect(window.confirm).toHaveBeenCalledWith('Cancelar a reserva de João às 10:00?');
  });

  it('mantém a reserva quando o usuário desiste do cancelamento', () => {
    book();
    vi.mocked(window.confirm).mockReturnValue(false);

    document.querySelector<HTMLButtonElement>('#reservation-list button')!.click();

    expect(loadReservations(localStorage)).toHaveLength(1);
    expect(document.querySelector('#reservation-list')!.textContent).toContain('João');
  });

  it('remove a reserva da tela e do armazenamento', () => {
    book();

    document.querySelector<HTMLButtonElement>('#reservation-list button')!.click();

    expect(loadReservations(localStorage)).toEqual([]);
    expect(document.querySelector('#reservation-list')!.children).toHaveLength(0);
    expect(document.querySelector('#booking-status')!.textContent).toBe('Reserva cancelada.');
  });

  it('cancela somente a reserva selecionada', () => {
    saveReservations(localStorage, [
      createReservation(input),
      createReservation({ ...input, owner: 'Maria', startMinute: 660, endMinute: 720 }),
    ]);
    consult();

    document.querySelector<HTMLButtonElement>('#reservation-list button')!.click();

    expect(loadReservations(localStorage).map((reservation) => reservation.owner)).toEqual(['Maria']);
    expect(document.querySelector('#reservation-list')!.textContent).toContain('Maria');
  });

  it('preserva a reserva exibida e informa falha quando a gravação é bloqueada', () => {
    book();
    const failure = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Gravação bloqueada.');
    });
    try {
      document.querySelector<HTMLButtonElement>('#reservation-list button')!.click();
      expect(loadReservations(localStorage)).toHaveLength(1);
      expect(document.querySelector('#reservation-list button')).not.toBeNull();
      expect(document.querySelector('#booking-status')!.textContent)
        .toContain('Não foi possível cancelar');
    } finally {
      failure.mockRestore();
    }
  });
});

describe('consulta na tela', () => {
  it('seleciona hoje e consulta a agenda ao abrir', () => {
    expect(document.querySelector<HTMLInputElement>('#date-filter')!.value).toBe(getLocalDate());
    expect(document.querySelector('#agenda-status')!.textContent).toContain('Nenhuma reserva');
  });

  it('atualiza os resultados ao trocar a sala', () => {
    saveReservations(localStorage, [
      createReservation(input),
      createReservation({ ...input, roomId: 'sala-102', owner: 'Maria' }),
    ]);
    consult();
    const roomFilter = document.querySelector<HTMLSelectElement>('#room-filter')!;

    roomFilter.value = 'sala-102';
    roomFilter.dispatchEvent(new Event('change', { bubbles: true }));

    expect(document.querySelector('#reservation-list')!.textContent).toContain('Maria');
    expect(document.querySelector('#reservation-list')!.textContent).not.toContain('João');
  });

  it('atualiza os resultados ao trocar a data', () => {
    saveReservations(localStorage, [createReservation(input)]);
    consult();
    const dateFilter = document.querySelector<HTMLInputElement>('#date-filter')!;

    dateFilter.value = '2026-12-02';
    dateFilter.dispatchEvent(new Event('change', { bubbles: true }));

    expect(document.querySelector('#reservation-list')!.children).toHaveLength(0);
    expect(document.querySelector('#agenda-status')!.textContent).toContain('Nenhuma reserva');
  });

  it('limpa a confirmação anterior ao mudar o contexto da reserva', () => {
    book();
    const roomFilter = document.querySelector<HTMLSelectElement>('#room-filter')!;

    roomFilter.value = 'sala-102';
    roomFilter.dispatchEvent(new Event('change', { bubbles: true }));

    expect(document.querySelector('#booking-status')!.textContent).toBe('');
  });

  it('oferece o catálogo de salas no filtro', () => {
    expect(document.querySelectorAll('#room-filter option')).toHaveLength(3);
    expect(document.querySelector('#room-filter')!.textContent).toContain('Auditório');
  });

  it('exibe horários e responsável da reserva correspondente', () => {
    saveReservations(localStorage, [createReservation(input)]);
    consult();
    expect(document.querySelector('#reservation-list')!.textContent)
      .toContain('10:00 – 11:00 · João');
  });

  it('informa quando a consulta não encontra reservas', () => {
    consult();
    expect(document.querySelector('#agenda-status')!.textContent).toContain('Nenhuma reserva');
  });

  it('remove resultados antigos ao consultar outra data', () => {
    saveReservations(localStorage, [createReservation(input)]);
    consult();
    consult('2026-12-02');
    expect(document.querySelector('#reservation-list')!.children).toHaveLength(0);
  });

  it('solicita uma data antes de consultar', () => {
    consult('');
    expect(document.querySelector('#agenda-status')!.textContent).toContain('Selecione uma data válida');
  });

  it('informa erro ao encontrar dados corrompidos', () => {
    localStorage.setItem('reserva-turno:reservations', '{');
    consult();
    expect(document.querySelector('#agenda-status')!.textContent).toContain('Não foi possível carregar');
  });

  it('exibe o nome do responsável como texto', () => {
    saveReservations(localStorage, [createReservation({
      ...input, owner: '<img src=x onerror=alert(1)>',
    })]);
    consult();
    expect(document.querySelector('#reservation-list img')).toBeNull();
    expect(document.querySelector('#reservation-list')!.textContent).toContain('<img');
  });
});
