import { describe, expect, it } from 'vitest';
import { findRoom, rooms } from '../src/reservas/salas';

describe('catálogo de salas', () => {
  it('oferece as salas disponíveis para reserva', () => {
    expect(rooms.map((room) => room.name)).toEqual([
      'Sala 101',
      'Sala 102',
      'Auditório',
    ]);
  });

  it('informa a capacidade da sala consultada', () => {
    expect(findRoom('sala-102')).toEqual({
      id: 'sala-102',
      name: 'Sala 102',
      capacity: 12,
    });
  });

  it('distingue as salas por identificadores únicos', () => {
    expect(new Set(rooms.map((room) => room.id)).size).toBe(rooms.length);
  });

  it('retorna indefinido ao consultar uma sala inexistente', () => {
    expect(findRoom('sala-999')).toBeUndefined();
  });

  it('retorna indefinido quando o identificador está vazio', () => {
    expect(findRoom('')).toBeUndefined();
  });
});
