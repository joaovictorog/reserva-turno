import type { Reservation } from './reserva';
import { isValidDate } from './data';
import { isValidTimeRange } from './horario';
import { findRoom } from './salas';
import { reservationsOverlap } from './conflitos';

export const reservationsKey = 'reserva-turno:reservations';

export function saveReservations(
  storage: Pick<Storage, 'setItem'>,
  reservations: readonly Reservation[],
): void {
  storage.setItem(reservationsKey, JSON.stringify(reservations));
}

function isReservation(value: unknown): value is Reservation {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const reservation = value as Record<string, unknown>;
  return typeof reservation.id === 'string'
    && reservation.id.trim().length > 0
    && typeof reservation.roomId === 'string'
    && Boolean(findRoom(reservation.roomId))
    && typeof reservation.date === 'string'
    && isValidDate(reservation.date)
    && typeof reservation.owner === 'string'
    && reservation.owner.trim().length > 0
    && typeof reservation.startMinute === 'number'
    && typeof reservation.endMinute === 'number'
    && isValidTimeRange(reservation.startMinute, reservation.endMinute);
}

export function loadReservations(storage: Pick<Storage, 'getItem'>): Reservation[] {
  const stored = storage.getItem(reservationsKey);
  if (stored === null) {
    return [];
  }
  const reservations: unknown = JSON.parse(stored);
  if (!Array.isArray(reservations) || !reservations.every(isReservation)) {
    throw new Error('Os dados salvos da agenda são inválidos.');
  }
  const ids = new Set(reservations.map((reservation) => reservation.id));
  if (ids.size !== reservations.length) {
    throw new Error('A agenda salva contém identificadores duplicados.');
  }
  const hasConflict = reservations.some((reservation, index) =>
    reservations.slice(0, index).some((previous) => reservationsOverlap(previous, reservation)));
  if (hasConflict) {
    throw new Error('A agenda salva contém reservas conflitantes.');
  }
  return reservations;
}
