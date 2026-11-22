import { describe, expect, it } from 'vitest';
import { listReservations } from '../src/reservas/agenda';
import { createReservation } from '../src/reservas/reserva';

const input = {
  roomId: 'sala-101',
  date: '2026-12-01',
  owner: 'João',
  startMinute: 600,
  endMinute: 660,
};

describe('consulta da agenda', () => {
  it('retorna as reservas da sala e data selecionadas', () => {
    const selected = createReservation(input);
    const anotherRoom = createReservation({ ...input, roomId: 'sala-102' });
    const anotherDate = createReservation({ ...input, date: '2026-12-02' });

    expect(listReservations([selected, anotherRoom, anotherDate], input.roomId, input.date))
      .toEqual([selected]);
  });

  it('retorna todas as reservas que correspondem ao filtro', () => {
    const morning = createReservation(input);
    const afternoon = createReservation({ ...input, startMinute: 840, endMinute: 900 });

    expect(listReservations([morning, afternoon], input.roomId, input.date))
      .toEqual([morning, afternoon]);
  });

  it('retorna uma lista vazia para uma agenda vazia', () => {
    expect(listReservations([], input.roomId, input.date)).toEqual([]);
  });

  it('exibe reservas em ordem cronológica mesmo quando cadastradas fora de ordem', () => {
    const morning = createReservation(input);
    const afternoon = createReservation({ ...input, startMinute: 840, endMinute: 900 });
    const evening = createReservation({ ...input, startMinute: 1080, endMinute: 1140 });

    expect(listReservations([evening, morning, afternoon], input.roomId, input.date))
      .toEqual([morning, afternoon, evening]);
  });

  it('preserva a ordem da coleção original ao ordenar os resultados', () => {
    const morning = createReservation(input);
    const afternoon = createReservation({ ...input, startMinute: 840, endMinute: 900 });
    const reservations = Object.freeze([afternoon, morning]);

    listReservations(reservations, input.roomId, input.date);

    expect(reservations).toEqual([afternoon, morning]);
  });

  it('retorna uma lista vazia quando nenhuma reserva corresponde', () => {
    expect(listReservations([createReservation(input)], 'auditorio', input.date))
      .toEqual([]);
  });

  it('preserva a coleção original durante a consulta', () => {
    const reservation = createReservation(input);
    const reservations = Object.freeze([reservation]);
    const result = listReservations(reservations, input.roomId, input.date);

    result.pop();

    expect(reservations).toEqual([reservation]);
  });
});
