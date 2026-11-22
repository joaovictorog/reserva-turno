import { scheduleReservation } from './agenda';
import { loadReservations, saveReservations } from './armazenamento';
import type { Reservation, ReservationInput } from './reserva';

export function reserveRoom(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  input: ReservationInput,
): Reservation[] {
  const reservations = loadReservations(storage);
  const updated = scheduleReservation(reservations, input);
  saveReservations(storage, updated);
  return updated;
}
