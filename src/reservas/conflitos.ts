import type { ReservationInput } from './reserva';

export function reservationsOverlap(
  first: ReservationInput,
  second: ReservationInput,
): boolean {
  return first.roomId === second.roomId
    && first.date === second.date
    && first.startMinute < second.endMinute
    && second.startMinute < first.endMinute;
}
