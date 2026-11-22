export function isValidDate(date: string): boolean {
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(0);
  parsed.setUTCFullYear(year, month - 1, day);

  return year >= 1
    && parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

export function formatDate(date: string): string {
  if (!isValidDate(date)) {
    throw new Error('Informe uma data válida.');
  }

  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
