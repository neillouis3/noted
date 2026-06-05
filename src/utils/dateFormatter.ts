import type { DateValue } from '@internationalized/date';
import { getLocalTimeZone, today } from '@internationalized/date';

const displayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function getTodayDate() {
  return today(getLocalTimeZone());
}

export function getTomorrowDate() {
  return getTodayDate().add({ days: 1 });
}

export function formatDateValue(date: DateValue) {
  return displayFormatter.format(date.toDate(getLocalTimeZone()));
}

export function formatDisplayDate(date: DateValue) {
  return formatDateValue(date);
}
