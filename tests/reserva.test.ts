import { describe, expect, it } from 'vitest';
import { createReservation, type ReservationInput } from '../src/reservas/reserva';

const validInput: ReservationInput = {
  roomId: 'sala-101',
  date: '2026-12-01',
  owner: 'João',
  startMinute: 540,
  endMinute: 600,
};

describe('criação de reservas', () => {
  it('preserva os dados de uma reserva válida', () => {
    expect(createReservation(validInput)).toEqual({
      ...validInput,
      id: expect.any(String),
    });
  });

  it('atribui identificadores distintos a reservas diferentes', () => {
    expect(createReservation(validInput).id).not.toBe(createReservation(validInput).id);
  });

  it('remove espaços nas extremidades do nome do responsável', () => {
    expect(createReservation({ ...validInput, owner: ' João ' }).owner).toBe('João');
  });

  it('rejeita uma sala inexistente', () => {
    expect(() => createReservation({ ...validInput, roomId: 'inexistente' }))
      .toThrow('Selecione uma sala válida.');
  });

  it('rejeita uma data inexistente', () => {
    expect(() => createReservation({ ...validInput, date: '2026-02-30' }))
      .toThrow('Informe uma data válida.');
  });

  it('rejeita um responsável contendo somente espaços', () => {
    expect(() => createReservation({ ...validInput, owner: '   ' }))
      .toThrow('Informe o responsável pela reserva.');
  });

  it('rejeita término anterior ao início', () => {
    expect(() => createReservation({ ...validInput, endMinute: 500 }))
      .toThrow('Informe um intervalo de horários válido.');
  });

  it('preserva os dados de entrada durante a criação', () => {
    const input = Object.freeze({ ...validInput, owner: ' João ' });
    createReservation(input);
    expect(input.owner).toBe(' João ');
  });
});
