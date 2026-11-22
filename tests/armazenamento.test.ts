import { describe, expect, it } from 'vitest';
import { saveReservations } from '../src/reservas/armazenamento';
import { cancelReservation } from '../src/reservas/agenda';
import { createReservation } from '../src/reservas/reserva';

const input = {
  roomId: 'sala-101',
  date: '2026-12-01',
  owner: 'João',
  startMinute: 600,
  endMinute: 660,
};

describe('gravação da agenda', () => {
  it('salva todos os dados da reserva incluindo seu identificador', () => {
    const data = new Map<string, string>();
    const storage = { setItem: (key: string, value: string) => data.set(key, value) };
    const reservation = createReservation(input);

    saveReservations(storage, [reservation]);

    expect(JSON.parse(data.get('reserva-turno:reservations')!)).toEqual([reservation]);
  });

  it('substitui os dados salvos após um cancelamento', () => {
    const data = new Map<string, string>();
    const storage = { setItem: (key: string, value: string) => data.set(key, value) };
    const reservation = createReservation(input);
    saveReservations(storage, [reservation]);

    saveReservations(storage, cancelReservation([reservation], reservation.id));

    expect(JSON.parse(data.get('reserva-turno:reservations')!)).toEqual([]);
  });

  it('preserva os demais dados do armazenamento', () => {
    const data = new Map([['theme', 'light']]);
    const storage = { setItem: (key: string, value: string) => data.set(key, value) };

    saveReservations(storage, []);

    expect(data.get('theme')).toBe('light');
  });

  it('propaga falhas de gravação para permitir feedback ao usuário', () => {
    const storage = {
      setItem() {
        throw new Error('Armazenamento indisponível.');
      },
    };

    expect(() => saveReservations(storage, []))
      .toThrow('Armazenamento indisponível.');
  });
});
