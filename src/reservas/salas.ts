export interface Room {
  readonly id: string;
  readonly name: string;
  readonly capacity: number;
}

export const rooms: readonly Room[] = Object.freeze([
  Object.freeze({ id: 'sala-101', name: 'Sala 101', capacity: 6 }),
  Object.freeze({ id: 'sala-102', name: 'Sala 102', capacity: 12 }),
  Object.freeze({ id: 'auditorio', name: 'Auditório', capacity: 40 }),
]);

export function findRoom(roomId: string): Room | undefined {
  return rooms.find((room) => room.id === roomId);
}
