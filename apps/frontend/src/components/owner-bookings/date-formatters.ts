const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  weekday: "short",
});

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

export const formatBookingDate = (value: string) => dateFormatter.format(new Date(value));
export const formatBookingTime = (value: string) => timeFormatter.format(new Date(value));
