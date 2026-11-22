import { describe, expect, it } from 'vitest';
import { hasPositiveDuration, isValidMinute, parseTime } from '../src/reservas/horario';

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

describe('limites de horário', () => {
  it('aceita meia-noite', () => {
    expect(isValidMinute(0)).toBe(true);
  });

  it('aceita o último minuto do dia', () => {
    expect(isValidMinute(1439)).toBe(true);
  });

  it('rejeita minutos negativos', () => {
    expect(isValidMinute(-1)).toBe(false);
  });

  it('rejeita minutos do dia seguinte', () => {
    expect(isValidMinute(1440)).toBe(false);
  });

  it('rejeita frações de minuto', () => {
    expect(isValidMinute(600.5)).toBe(false);
  });

  it('rejeita valores indefinidos numericamente', () => {
    expect(isValidMinute(Number.NaN)).toBe(false);
  });

  it('rejeita valores infinitos', () => {
    expect(isValidMinute(Number.POSITIVE_INFINITY)).toBe(false);
  });
});

describe('conversão de horários', () => {
  it('converte meia-noite para zero minutos', () => {
    expect(parseTime('00:00')).toBe(0);
  });

  it('converte horas e minutos de uma reserva', () => {
    expect(parseTime('09:30')).toBe(570);
  });

  it('converte o último horário do dia', () => {
    expect(parseTime('23:59')).toBe(1439);
  });

  it.each(['24:00', '12:60', '-1:00', '9:30', '09:3', '', '09:30:00', ' 09:30', '09:30\n'])(
    'rejeita o horário inválido %j',
    (time) => {
      expect(() => parseTime(time)).toThrow('Horário deve estar no formato HH:mm');
    },
  );
});
