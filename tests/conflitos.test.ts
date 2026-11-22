import { describe, expect, it } from 'vitest';
import { reservationsOverlap } from '../src/reservas/conflitos';
import type { ReservationInput } from '../src/reservas/reserva';

const reservation: ReservationInput = {
  roomId: 'sala-101',
  date: '2026-12-01',
  owner: 'João',
  startMinute: 600,
  endMinute: 660,
};

describe('conflitos de reservas', () => {
  it('detecta horários idênticos na mesma sala e data', () => {
    const anotherReservation = { ...reservation, owner: 'Maria' };
    expect(reservationsOverlap(reservation, anotherReservation)).toBe(true);
  });

  it('detecta sobreposição no início da reserva', () => {
    expect(reservationsOverlap(reservation, {
      ...reservation, startMinute: 570, endMinute: 630,
    })).toBe(true);
  });

  it('detecta sobreposição no fim da reserva', () => {
    expect(reservationsOverlap(reservation, {
      ...reservation, startMinute: 630, endMinute: 690,
    })).toBe(true);
  });

  it('detecta um intervalo contido na reserva', () => {
    expect(reservationsOverlap(reservation, {
      ...reservation, startMinute: 615, endMinute: 645,
    })).toBe(true);
  });

  it('detecta um intervalo que engloba a reserva', () => {
    expect(reservationsOverlap(reservation, {
      ...reservation, startMinute: 570, endMinute: 690,
    })).toBe(true);
  });

  it('permite uma reserva começando quando a anterior termina', () => {
    expect(reservationsOverlap(reservation, {
      ...reservation, startMinute: 660, endMinute: 720,
    })).toBe(false);
  });

  it('permite uma reserva terminando quando a seguinte começa', () => {
    expect(reservationsOverlap(reservation, {
      ...reservation, startMinute: 540, endMinute: 600,
    })).toBe(false);
  });

  it('permite o mesmo horário em salas distintas', () => {
    expect(reservationsOverlap(reservation, {
      ...reservation, roomId: 'sala-102',
    })).toBe(false);
  });

  it('permite o mesmo horário em datas distintas', () => {
    expect(reservationsOverlap(reservation, {
      ...reservation, date: '2026-12-02',
    })).toBe(false);
  });
});
