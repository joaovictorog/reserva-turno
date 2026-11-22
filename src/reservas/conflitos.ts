import type { ReservationInput } from './reserva';

export type ReservationSlot = Omit<ReservationInput, 'owner'>;

export function reservationsOverlap(
  first: ReservationSlot,
  second: ReservationSlot,
): boolean {
  return first.roomId === second.roomId
    && first.date === second.date
    && first.startMinute < second.endMinute
    && second.startMinute < first.endMinute;
}
