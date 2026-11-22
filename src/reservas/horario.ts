export function hasPositiveDuration(startMinute: number, endMinute: number): boolean {
  return endMinute > startMinute;
}

export function isValidMinute(minute: number): boolean {
  return Number.isInteger(minute) && minute >= 0 && minute < 1440;
}
