import { describe, expect, it } from 'vitest';
import { scheduleReservation } from '../src/reservas/agenda';
import { createReservation, type ReservationInput } from '../src/reservas/reserva';

const input: ReservationInput = {
  roomId: 'sala-101',
  date: '2026-12-01',
  owner: 'João',
  startMinute: 600,
  endMinute: 660,
};

describe('agendamento de reservas', () => {
  it('adiciona a primeira reserva à agenda', () => {
    expect(scheduleReservation([], input)).toEqual([
      { ...input, id: expect.any(String) },
    ]);
  });

  it('preserva a agenda original ao adicionar uma reserva', () => {
    const existing = createReservation(input);
    const reservations = Object.freeze([existing]);
    const result = scheduleReservation(reservations, {
      ...input, startMinute: 660, endMinute: 720,
    });
    expect(reservations).toEqual([existing]);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(existing);
  });

  it('rejeita um conflito com qualquer reserva da agenda', () => {
    const reservations = [
      createReservation({ ...input, roomId: 'sala-102' }),
      createReservation(input),
    ];
    expect(() => scheduleReservation(reservations, input))
      .toThrow('A sala já está reservada nesse horário.');
    expect(reservations).toHaveLength(2);
  });

  it('permite agendar o mesmo horário em outra sala', () => {
    expect(scheduleReservation([createReservation(input)], {
      ...input, roomId: 'sala-102',
    })).toHaveLength(2);
  });

  it('permite agendar o mesmo horário em outra data', () => {
    expect(scheduleReservation([createReservation(input)], {
      ...input, date: '2026-12-02',
    })).toHaveLength(2);
  });

  it('valida os dados antes de incluir a reserva', () => {
    expect(() => scheduleReservation([], { ...input, owner: ' ' }))
      .toThrow('Informe o responsável pela reserva.');
  });
});
