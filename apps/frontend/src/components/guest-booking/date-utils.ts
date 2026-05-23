const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  weekday: "long",
});

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

export function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayDateString() {
  return toDateString(new Date());
}

export function normalizeDateValue(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value.slice(0, 10) : toDateString(value);
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

export function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}
