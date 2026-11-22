import { describe, expect, it } from 'vitest';
import { formatDate, isValidDate } from '../src/reservas/data';

describe('data da reserva', () => {
  it('aceita uma data no formato ISO', () => {
    expect(isValidDate('2026-11-22')).toBe(true);
  });

  it('aceita fevereiro com 29 dias em ano bissexto', () => {
    expect(isValidDate('2028-02-29')).toBe(true);
  });

  it('aceita ano divisível por 400 como bissexto', () => {
    expect(isValidDate('2000-02-29')).toBe(true);
  });

  it('rejeita fevereiro com 29 dias em ano comum', () => {
    expect(isValidDate('2026-02-29')).toBe(false);
  });

  it('rejeita ano secular que não seja divisível por 400 como bissexto', () => {
    expect(isValidDate('2100-02-29')).toBe(false);
  });

  it('rejeita dia inexistente em mês de 30 dias', () => {
    expect(isValidDate('2026-04-31')).toBe(false);
  });

  it.each(['2026-00-10', '2026-13-10', '2026-01-00', '2026-01-32', '0000-01-01'])(
    'rejeita a data fora dos limites %j',
    (date) => {
      expect(isValidDate(date)).toBe(false);
    },
  );

  it.each(['', '22/11/2026', '2026-1-01', '2026-11-22T00:00:00', '2026-11-22\n'])(
    'rejeita o formato inválido %j',
    (date) => {
      expect(isValidDate(date)).toBe(false);
    },
  );
});

describe('exibição da data da reserva', () => {
  it('exibe dia, mês e ano no formato brasileiro', () => {
    expect(formatDate('2026-12-01')).toBe('01/12/2026');
  });

  it('preserva o dia bissexto na exibição', () => {
    expect(formatDate('2028-02-29')).toBe('29/02/2028');
  });

  it('preserva os quatro dígitos do ano', () => {
    expect(formatDate('0001-01-01')).toBe('01/01/0001');
  });

  it('rejeita uma data inexistente', () => {
    expect(() => formatDate('2026-02-30')).toThrow('Informe uma data válida.');
  });

  it('rejeita entrada fora do formato ISO', () => {
    expect(() => formatDate('01/12/2026')).toThrow('Informe uma data válida.');
  });
});
