const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateOnly(value: string) {
  if (!dateOnlyPattern.test(value)) {
    return undefined;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return undefined;
  }

  return { day, month, year };
}

export function addDays(date: { day: number; month: number; year: number }, days: number) {
  const nextDate = new Date(Date.UTC(date.year, date.month - 1, date.day + days));

  return {
    day: nextDate.getUTCDate(),
    month: nextDate.getUTCMonth() + 1,
    year: nextDate.getUTCFullYear(),
  };
}

export function moscowLocalDateTimeToIso(
  date: { day: number; month: number; year: number },
  hour: number,
  minute: number,
) {
  return new Date(Date.UTC(date.year, date.month - 1, date.day, hour - 3, minute, 0, 0)).toISOString();
}

export function addMinutesIso(value: string, minutes: number) {
  return new Date(new Date(value).getTime() + minutes * 60_000).toISOString();
}

export function isValidDateTime(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value;
}
