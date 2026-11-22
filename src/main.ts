import './style.css';
import { rooms } from './reservas/salas';

const roomFilter = document.querySelector<HTMLSelectElement>('#room-filter')!;
roomFilter.replaceChildren(...rooms.map((room) =>
  new Option(`${room.name} · ${room.capacity} pessoas`, room.id)));
