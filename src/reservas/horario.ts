export function hasPositiveDuration(startMinute: number, endMinute: number): boolean {
  return endMinute > startMinute;
}

export function isValidMinute(minute: number): boolean {
  return Number.isInteger(minute) && minute >= 0 && minute < 1440;
}

export function isValidTimeRange(startMinute: number, endMinute: number): boolean {
  return isValidMinute(startMinute)
    && isValidMinute(endMinute)
    && hasPositiveDuration(startMinute, endMinute);
}

export function parseTime(time: string): number {
  if (!/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    throw new Error('Horário deve estar no formato HH:mm entre 00:00 e 23:59.');
  }

  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatTime(minute: number): string {
  if (!isValidMinute(minute)) {
    throw new Error('Horário deve ser um minuto inteiro entre 0 e 1439.');
  }

  const hours = Math.floor(minute / 60).toString().padStart(2, '0');
  const minutes = (minute % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
