export const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

export const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

export const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"] as const;

export const WEEKDAYS_SHORT = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"] as const;

const WEEKDAYS_LONG = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"] as const;

export type DateParts = {
  year: number;
  month: number;
  day: number;
};

export type MonthRef = {
  year: number;
  month: number;
};

export function parseDateKey(key: string): DateParts {
  const [year, month, day] = key.split("-").map(Number);
  return { year, month: month - 1, day };
}

export function dateKeyFromParts(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function toDateKey(date: Date): string {
  return dateKeyFromParts(date.getFullYear(), date.getMonth(), date.getDate());
}

function toLocalDate(key: string): Date {
  const { year, month, day } = parseDateKey(key);
  return new Date(year, month, day);
}

export function addDays(key: string, amount: number): string {
  const date = toLocalDate(key);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

export function weekdayIndex(key: string): number {
  return (toLocalDate(key).getDay() + 6) % 7;
}

export function formatWeekday(key: string): string {
  return WEEKDAYS_LONG[weekdayIndex(key)];
}

export function daysInclusive(start: string, end: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((toLocalDate(end).getTime() - toLocalDate(start).getTime()) / msPerDay) + 1;
}

export function formatDate(key: string): string {
  const { year, month, day } = parseDateKey(key);
  return `${day} ${MONTHS_GENITIVE[month]} ${year}`;
}

export function formatDayMonth(key: string): string {
  const { month, day } = parseDateKey(key);
  return `${day} ${MONTHS_SHORT[month]}`;
}

export function formatDateRange(start: string, end: string): string {
  if (start === end) {
    return formatDate(start);
  }

  const from = parseDateKey(start);
  const to = parseDateKey(end);

  if (from.year !== to.year) {
    return `${formatDate(start)} – ${formatDate(end)}`;
  }

  if (from.month !== to.month) {
    return `${from.day} ${MONTHS_GENITIVE[from.month]} – ${to.day} ${MONTHS_GENITIVE[to.month]} ${to.year}`;
  }

  return `${from.day} – ${to.day} ${MONTHS_GENITIVE[to.month]} ${to.year}`;
}

export function formatMonthYear({ year, month }: MonthRef): string {
  return `${MONTHS_NOMINATIVE[month]} ${year}`;
}

export function monthOf(key: string): MonthRef {
  const { year, month } = parseDateKey(key);
  return { year, month };
}

export function shiftMonth({ year, month }: MonthRef, delta: number): MonthRef {
  const index = year * 12 + month + delta;
  return { year: Math.floor(index / 12), month: index % 12 };
}

export function monthKey({ year, month }: MonthRef): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function parseMonthKey(value: string | null): MonthRef | null {
  const match = value?.match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const month = Number(match[2]) - 1;
  return month >= 0 && month < 12 ? { year: Number(match[1]), month } : null;
}

export function getMonthGrid({ year, month }: MonthRef): Array<Array<string | null>> {
  const firstKey = dateKeyFromParts(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<string | null> = Array.from({ length: weekdayIndex(firstKey) }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(dateKeyFromParts(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7));
}

export function getWeekBounds(key: string): { start: string; end: string } {
  const start = addDays(key, -weekdayIndex(key));
  return { start, end: addDays(start, 6) };
}
