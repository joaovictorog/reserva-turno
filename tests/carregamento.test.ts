import { describe, expect, it } from 'vitest';
import { loadReservations, saveReservations } from '../src/reservas/armazenamento';
import { createReservation } from '../src/reservas/reserva';

const reservation = {
  id: 'reserva-1',
  roomId: 'sala-101',
  date: '2026-12-01',
  owner: 'João',
  startMinute: 600,
  endMinute: 660,
};

describe('recuperação da agenda', () => {
  it('inicia uma agenda vazia quando ainda não existem dados salvos', () => {
    expect(loadReservations({ getItem: () => null })).toEqual([]);
  });

  it('recupera uma agenda vazia salva após cancelamentos', () => {
    expect(loadReservations({ getItem: () => '[]' })).toEqual([]);
  });

  it('recupera os dados e o identificador após gravar', () => {
    const data = new Map<string, string>();
    const storage = {
      setItem: (key: string, value: string) => data.set(key, value),
      getItem: (key: string) => data.get(key) ?? null,
    };
    const saved = createReservation(reservation);
    saveReservations(storage, [saved]);

    expect(loadReservations(storage)).toEqual([saved]);
  });

  it('sinaliza JSON corrompido', () => {
    expect(() => loadReservations({ getItem: () => '{' })).toThrow();
  });

  it.each([null, {}, [null], [42], [{}]])(
    'rejeita uma estrutura de agenda inválida %j',
    (value) => {
      expect(() => loadReservations({ getItem: () => JSON.stringify(value) }))
        .toThrow('Os dados salvos da agenda são inválidos.');
    },
  );

  it.each([
    { id: 1 }, { id: ' ' },
    { roomId: 1 }, { roomId: 'inexistente' },
    { date: 1 }, { date: '2026-02-30' },
    { owner: 1 }, { owner: ' ' },
    { startMinute: '600' }, { endMinute: '660' }, { endMinute: 500 },
  ])('rejeita reserva com campo inválido %j', (fields) => {
    const stored = JSON.stringify([{ ...reservation, ...fields }]);
    expect(() => loadReservations({ getItem: () => stored }))
      .toThrow('Os dados salvos da agenda são inválidos.');
  });

  it('propaga falhas de acesso ao armazenamento', () => {
    const storage = {
      getItem() {
        throw new Error('Acesso bloqueado.');
      },
    };
    expect(() => loadReservations(storage)).toThrow('Acesso bloqueado.');
  });

  it('rejeita IDs duplicados mesmo em salas distintas', () => {
    const stored = JSON.stringify([
      reservation,
      { ...reservation, roomId: 'sala-102' },
    ]);
    expect(() => loadReservations({ getItem: () => stored }))
      .toThrow('A agenda salva contém identificadores duplicados.');
  });

  it('rejeita conflitos entre reservas com IDs distintos', () => {
    const stored = JSON.stringify([
      reservation,
      { ...reservation, id: 'reserva-2', startMinute: 630, endMinute: 690 },
    ]);
    expect(() => loadReservations({ getItem: () => stored }))
      .toThrow('A agenda salva contém reservas conflitantes.');
  });

  it('recupera reservas consecutivas na mesma sala', () => {
    const reservations = [
      reservation,
      { ...reservation, id: 'reserva-2', startMinute: 660, endMinute: 720 },
    ];
    expect(loadReservations({ getItem: () => JSON.stringify(reservations) }))
      .toEqual(reservations);
  });

  it('recupera reservas simultâneas em salas diferentes', () => {
    const reservations = [
      reservation,
      { ...reservation, id: 'reserva-2', roomId: 'sala-102' },
    ];
    expect(loadReservations({ getItem: () => JSON.stringify(reservations) }))
      .toEqual(reservations);
  });

  it('preserva o conteúdo salvo quando encontra um conflito', () => {
    const data = new Map([[
      'reserva-turno:reservations',
      JSON.stringify([reservation, { ...reservation, id: 'reserva-2' }]),
    ]]);
    const stored = data.get('reserva-turno:reservations');
    const storage = { getItem: (key: string) => data.get(key) ?? null };

    expect(() => loadReservations(storage)).toThrow();
    expect(data.get('reserva-turno:reservations')).toBe(stored);
  });
});
