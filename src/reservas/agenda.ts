import { reservationsOverlap } from './conflitos';
import { createReservation, type Reservation, type ReservationInput } from './reserva';

export function scheduleReservation(
  reservations: readonly Reservation[],
  input: ReservationInput,
): Reservation[] {
  const reservation = createReservation(input);
  if (reservations.some((existing) => reservationsOverlap(existing, reservation))) {
    throw new Error('A sala já está reservada nesse horário.');
  }
  return [...reservations, reservation];
}

export function cancelReservation(
  reservations: readonly Reservation[],
  reservationId: string,
): Reservation[] {
  if (!reservations.some((reservation) => reservation.id === reservationId)) {
    throw new Error('Reserva não encontrada.');
  }
  return reservations.filter((reservation) => reservation.id !== reservationId);
}
