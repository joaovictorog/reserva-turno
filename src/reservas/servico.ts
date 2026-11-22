import { cancelReservation, scheduleReservation } from './agenda';
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

export function cancelRoomReservation(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  reservationId: string,
): Reservation[] {
  const reservations = loadReservations(storage);
  const updated = cancelReservation(reservations, reservationId);
  saveReservations(storage, updated);
  return updated;
}
