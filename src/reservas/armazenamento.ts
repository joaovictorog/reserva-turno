import type { Reservation } from './reserva';

export function saveReservations(
  storage: Pick<Storage, 'setItem'>,
  reservations: readonly Reservation[],
): void {
  storage.setItem('reserva-turno:reservations', JSON.stringify(reservations));
}
