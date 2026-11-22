import './style.css';
import { rooms } from './reservas/salas';
import { loadReservations } from './reservas/armazenamento';
import { listReservations } from './reservas/agenda';
import { formatTime } from './reservas/horario';
import { isValidDate } from './reservas/data';

const roomFilter = document.querySelector<HTMLSelectElement>('#room-filter')!;
roomFilter.replaceChildren(...rooms.map((room) =>
  new Option(`${room.name} · ${room.capacity} pessoas`, room.id)));

const filters = document.querySelector<HTMLFormElement>('#filters')!;
const dateFilter = document.querySelector<HTMLInputElement>('#date-filter')!;
const status = document.querySelector<HTMLParagraphElement>('#agenda-status')!;
const reservationList = document.querySelector<HTMLDivElement>('#reservation-list')!;

filters.addEventListener('submit', (event) => {
  event.preventDefault();
  reservationList.replaceChildren();
  if (!isValidDate(dateFilter.value)) {
    status.textContent = 'Selecione uma data válida.';
    return;
  }

  try {
    const reservations = listReservations(
      loadReservations(localStorage), roomFilter.value, dateFilter.value,
    );
    for (const reservation of reservations) {
      const row = document.createElement('p');
      row.textContent = `${formatTime(reservation.startMinute)} – ${formatTime(reservation.endMinute)} · ${reservation.owner}`;
      reservationList.append(row);
    }
    status.textContent = reservations.length === 0
      ? 'Nenhuma reserva para esta sala nesta data.'
      : `${reservations.length} reserva(s) encontrada(s).`;
  } catch {
    status.textContent = 'Não foi possível carregar a agenda. Verifique os dados salvos e tente novamente.';
  }
});
