import { describe, expect, it } from 'vitest';
import { isValidTimeRange } from '../src/reservas/horario';

describe('intervalo da reserva', () => {
  it('aceita uma reserva dentro do mesmo dia', () => {
    expect(isValidTimeRange(540, 600)).toBe(true);
  });

  it('aceita uma reserva começando à meia-noite', () => {
    expect(isValidTimeRange(0, 60)).toBe(true);
  });

  it('aceita uma reserva terminando no último minuto do dia', () => {
    expect(isValidTimeRange(1438, 1439)).toBe(true);
  });

  it('rejeita início anterior ao dia da reserva', () => {
    expect(isValidTimeRange(-1, 600)).toBe(false);
  });

  it('rejeita término no dia seguinte', () => {
    expect(isValidTimeRange(600, 1440)).toBe(false);
  });

  it('rejeita reserva sem duração', () => {
    expect(isValidTimeRange(600, 600)).toBe(false);
  });

  it('rejeita término anterior ao início', () => {
    expect(isValidTimeRange(600, 540)).toBe(false);
  });
});
