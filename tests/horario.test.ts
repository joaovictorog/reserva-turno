import { describe, expect, it } from 'vitest';
import { hasPositiveDuration } from '../src/reservas/horario';

describe('duração da reserva', () => {
  it('aceita um intervalo de um minuto', () => {
    expect(hasPositiveDuration(600, 601)).toBe(true);
  });

  it('rejeita uma reserva que começa e termina no mesmo minuto', () => {
    expect(hasPositiveDuration(600, 600)).toBe(false);
  });

  it('rejeita término anterior ao início', () => {
    expect(hasPositiveDuration(600, 599)).toBe(false);
  });
});
