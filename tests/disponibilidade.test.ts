import { describe, expect, it } from 'vitest';
import { isRoomAvailable } from '../src/reservas/disponibilidade';
import { cancelReservation } from '../src/reservas/agenda';
import { createReservation } from '../src/reservas/reserva';

const slot = {
  roomId: 'sala-101',
  date: '2026-12-01',
  startMinute: 600,
  endMinute: 660,
};

describe('disponibilidade de salas', () => {
  it('informa disponibilidade quando a agenda está vazia', () => {
    expect(isRoomAvailable([], slot)).toBe(true);
  });

  it('informa indisponibilidade quando há conflito', () => {
    const reservation = createReservation({ ...slot, owner: 'João' });
    expect(isRoomAvailable([reservation], slot)).toBe(false);
  });

  it('permite consultar o horário seguinte a uma reserva', () => {
    const reservation = createReservation({ ...slot, owner: 'João' });
    expect(isRoomAvailable([reservation], {
      ...slot, startMinute: 660, endMinute: 720,
    })).toBe(true);
  });

  it('considera disponível uma sala após cancelamento', () => {
    const reservation = createReservation({ ...slot, owner: 'João' });
    const reservations = cancelReservation([reservation], reservation.id);
    expect(isRoomAvailable(reservations, slot)).toBe(true);
  });

  it('rejeita consulta de sala inexistente', () => {
    expect(isRoomAvailable([], { ...slot, roomId: 'inexistente' })).toBe(false);
  });

  it('rejeita consulta com data inválida', () => {
    expect(isRoomAvailable([], { ...slot, date: '2026-02-30' })).toBe(false);
  });

  it('rejeita consulta com intervalo inválido', () => {
    expect(isRoomAvailable([], { ...slot, endMinute: 600 })).toBe(false);
  });
});
