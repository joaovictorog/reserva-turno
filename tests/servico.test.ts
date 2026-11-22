import { describe, expect, it } from 'vitest';
import { reserveRoom } from '../src/reservas/servico';
import { loadReservations } from '../src/reservas/armazenamento';

function createStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
  };
}

const input = {
  roomId: 'sala-101',
  date: '2026-12-01',
  owner: 'João',
  startMinute: 600,
  endMinute: 660,
};

describe('agendamento persistente', () => {
  it('retorna a mesma agenda disponível para carregamento posterior', () => {
    const storage = createStorage();

    const result = reserveRoom(storage, input);

    expect(loadReservations(storage)).toEqual(result);
    expect(result).toEqual([{ ...input, id: expect.any(String) }]);
  });

  it('preserva reservas anteriores ao gravar uma nova', () => {
    const storage = createStorage();
    const first = reserveRoom(storage, input);

    const result = reserveRoom(storage, { ...input, roomId: 'sala-102' });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(first[0]);
    expect(loadReservations(storage)).toEqual(result);
  });

  it('mantém a agenda salva após tentativa de agendamento conflitante', () => {
    const storage = createStorage();
    const previous = reserveRoom(storage, input);

    expect(() => reserveRoom(storage, input)).toThrow('A sala já está reservada');
    expect(loadReservations(storage)).toEqual(previous);
  });

  it('mantém a agenda salva após tentativa com dados inválidos', () => {
    const storage = createStorage();
    const previous = reserveRoom(storage, input);

    expect(() => reserveRoom(storage, { ...input, owner: '' })).toThrow();
    expect(loadReservations(storage)).toEqual(previous);
  });

  it('sinaliza falha quando não consegue gravar a reserva', () => {
    const storage = {
      getItem: () => null,
      setItem() { throw new Error('Sem espaço disponível.'); },
    };

    expect(() => reserveRoom(storage, input)).toThrow('Sem espaço disponível.');
  });

  it('preserva dados corrompidos ao sinalizar falha no carregamento', () => {
    const storage = createStorage();
    storage.setItem('reserva-turno:reservations', '{');

    expect(() => reserveRoom(storage, input)).toThrow();
    expect(storage.getItem('reserva-turno:reservations')).toBe('{');
  });
});
