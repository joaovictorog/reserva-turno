import { isValidDate } from './data';
import { isValidTimeRange } from './horario';
import { findRoom } from './salas';

export interface ReservationInput {
  roomId: string;
  date: string;
  owner: string;
  startMinute: number;
  endMinute: number;
}

export interface Reservation extends ReservationInput {
  id: string;
}

export function createReservation(input: ReservationInput): Reservation {
  if (!findRoom(input.roomId)) {
    throw new Error('Selecione uma sala válida.');
  }
  if (!isValidDate(input.date)) {
    throw new Error('Informe uma data válida.');
  }
  const owner = input.owner.trim();
  if (!owner) {
    throw new Error('Informe o responsável pela reserva.');
  }
  if (!isValidTimeRange(input.startMinute, input.endMinute)) {
    throw new Error('Informe um intervalo de horários válido.');
  }

  return {
    id: crypto.randomUUID(),
    roomId: input.roomId,
    date: input.date,
    owner,
    startMinute: input.startMinute,
    endMinute: input.endMinute,
  };
}
