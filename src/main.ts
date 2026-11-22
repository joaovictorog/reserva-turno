import './style.css';
import { rooms } from './reservas/salas';
import { loadReservations } from './reservas/armazenamento';
import { listReservations } from './reservas/agenda';
import { formatTime, isValidTimeRange, parseTime } from './reservas/horario';
import { getLocalDate, isValidDate } from './reservas/data';
import { cancelRoomReservation, reserveRoom } from './reservas/servico';
import { isRoomAvailable } from './reservas/disponibilidade';

const roomFilter = document.querySelector<HTMLSelectElement>('#room-filter')!;
roomFilter.replaceChildren(...rooms.map((room) =>
  new Option(`${room.name} · ${room.capacity} pessoas`, room.id)));

const filters = document.querySelector<HTMLFormElement>('#filters')!;
const dateFilter = document.querySelector<HTMLInputElement>('#date-filter')!;
dateFilter.value = getLocalDate();
const status = document.querySelector<HTMLParagraphElement>('#agenda-status')!;
const reservationList = document.querySelector<HTMLDivElement>('#reservation-list')!;

function renderAgenda() {
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
      const row = document.createElement('div');
      row.className = 'reservation-row';
      const details = document.createElement('span');
      details.textContent = `${formatTime(reservation.startMinute)} – ${formatTime(reservation.endMinute)} · ${reservation.owner}`;
      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.textContent = 'Cancelar';
      cancelButton.setAttribute('aria-label', `Cancelar reserva de ${reservation.owner} às ${formatTime(reservation.startMinute)}`);
      cancelButton.addEventListener('click', () => {
        if (!window.confirm(`Cancelar a reserva de ${reservation.owner} às ${formatTime(reservation.startMinute)}?`)) {
          return;
        }
        try {
          cancelRoomReservation(localStorage, reservation.id);
          renderAgenda();
          bookingStatus.textContent = 'Reserva cancelada.';
        } catch {
          bookingStatus.textContent = 'Não foi possível cancelar a reserva. Tente novamente.';
        }
      });
      row.append(details, cancelButton);
      reservationList.append(row);
    }
    status.textContent = reservations.length === 0
      ? 'Nenhuma reserva para esta sala nesta data.'
      : `${reservations.length} reserva(s) encontrada(s).`;
  } catch {
    status.textContent = 'Não foi possível carregar a agenda. Verifique os dados salvos e tente novamente.';
  }
}

filters.addEventListener('submit', (event) => {
  event.preventDefault();
  renderAgenda();
});

const bookingForm = document.querySelector<HTMLFormElement>('#booking-form')!;
const bookingStatus = document.querySelector<HTMLParagraphElement>('#booking-status')!;

filters.addEventListener('change', () => {
  bookingStatus.textContent = '';
  renderAgenda();
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(bookingForm);
  try {
    reserveRoom(localStorage, {
      roomId: roomFilter.value,
      date: dateFilter.value,
      owner: String(fields.get('owner')),
      startMinute: parseTime(String(fields.get('startTime'))),
      endMinute: parseTime(String(fields.get('endTime'))),
    });
    bookingStatus.textContent = 'Reserva confirmada.';
    bookingForm.reset();
    renderAgenda();
  } catch (error) {
    bookingStatus.textContent = error instanceof Error
      ? error.message
      : 'Não foi possível salvar a reserva.';
  }
});

document.querySelector<HTMLButtonElement>('#check-availability')!.addEventListener('click', () => {
  const fields = new FormData(bookingForm);
  try {
    const slot = {
      roomId: roomFilter.value,
      date: dateFilter.value,
      startMinute: parseTime(String(fields.get('startTime'))),
      endMinute: parseTime(String(fields.get('endTime'))),
    };
    if (!isValidDate(slot.date) || !isValidTimeRange(slot.startMinute, slot.endMinute)) {
      bookingStatus.textContent = 'Informe uma data e um intervalo de horários válidos.';
      return;
    }
    bookingStatus.textContent = isRoomAvailable(loadReservations(localStorage), slot)
      ? 'Sala disponível neste horário.'
      : 'Sala indisponível neste horário.';
  } catch {
    bookingStatus.textContent = 'Não foi possível verificar. Confira os horários e os dados salvos.';
  }
});

renderAgenda();
