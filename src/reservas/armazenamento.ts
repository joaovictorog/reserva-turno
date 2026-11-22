import type { Reservation } from './reserva';
import { isValidDate } from './data';
import { isValidTimeRange } from './horario';
import { findRoom } from './salas';

export function saveReservations(
  storage: Pick<Storage, 'setItem'>,
  reservations: readonly Reservation[],
): void {
  storage.setItem('reserva-turno:reservations', JSON.stringify(reservations));
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
  const stored = storage.getItem('reserva-turno:reservations');
  if (stored === null) {
    return [];
  }
  const reservations: unknown = JSON.parse(stored);
  if (!Array.isArray(reservations) || !reservations.every(isReservation)) {
    throw new Error('Os dados salvos da agenda são inválidos.');
  }
  return reservations;
}
