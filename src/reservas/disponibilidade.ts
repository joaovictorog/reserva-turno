import { reservationsOverlap, type ReservationSlot } from './conflitos';
import { isValidDate } from './data';
import { isValidTimeRange } from './horario';
import type { Reservation } from './reserva';
import { findRoom } from './salas';

export function isRoomAvailable(
  reservations: readonly Reservation[],
  slot: ReservationSlot,
): boolean {
  return Boolean(findRoom(slot.roomId))
    && isValidDate(slot.date)
    && isValidTimeRange(slot.startMinute, slot.endMinute)
    && !reservations.some((reservation) => reservationsOverlap(reservation, slot));
}
