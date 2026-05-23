import { ApiError } from "../errors.js";
import type { Booking, EventType, Slot } from "../types.js";

type PlainDate = {
  day: number;
  month: number;
  year: number;
};

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const morningStart = { hour: 9, minute: 0 };
const morningEnd = { hour: 11, minute: 0 };
const afternoonStart = { hour: 16, minute: 30 };
const bookingWindowDays = 14;

function parseDateOnly(value: string) {
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

function addDays(date: PlainDate, days: number) {
  const nextDate = new Date(Date.UTC(date.year, date.month - 1, date.day + days));

  return {
    day: nextDate.getUTCDate(),
    month: nextDate.getUTCMonth() + 1,
    year: nextDate.getUTCFullYear(),
  };
}

function moscowLocalDateTimeToIso(date: PlainDate, hour: number, minute: number) {
  return new Date(Date.UTC(date.year, date.month - 1, date.day, hour - 3, minute, 0, 0)).toISOString();
}

function isExistingStart(bookings: Booking[], startAt: string) {
  return bookings.some((booking) => booking.startAt === startAt);
}

function toMinutes(time: { hour: number; minute: number }) {
  return time.hour * 60 + time.minute;
}

function fromMinutes(value: number) {
  return {
    hour: Math.floor(value / 60),
    minute: value % 60,
  };
}

export class BookingScheduleService {
  listSlots(eventType: EventType, bookings: Booking[], fromDate: string) {
    const parsedDate = parseDateOnly(fromDate);

    if (!parsedDate) {
      throw new ApiError("invalid_from_date");
    }

    const nowMs = new Date().getTime();
    const slots: Slot[] = [];

    for (let dayOffset = 0; dayOffset < bookingWindowDays; dayOffset += 1) {
      const date = addDays(parsedDate, dayOffset);
      const morningStartMinutes = toMinutes(morningStart);
      const morningEndMinutes = toMinutes(morningEnd);

      for (
        let startMinutes = morningStartMinutes;
        startMinutes <= morningEndMinutes;
        startMinutes += eventType.durationMinutes
      ) {
        const startTime = fromMinutes(startMinutes);
        slots.push(this.buildSlot(eventType, date, startTime.hour, startTime.minute, bookings, nowMs));
      }

      slots.push(this.buildSlot(eventType, date, afternoonStart.hour, afternoonStart.minute, bookings, nowMs));
    }

    return slots;
  }

  addMinutesIso(value: string, minutes: number) {
    return new Date(new Date(value).getTime() + minutes * 60_000).toISOString();
  }

  isValidDateTime(value: string) {
    const time = Date.parse(value);
    return Number.isFinite(time) && new Date(time).toISOString() === value;
  }

  private buildSlot(
    eventType: EventType,
    date: PlainDate,
    hour: number,
    minute: number,
    bookings: Booking[],
    nowMs: number,
  ): Slot {
    const startAt = moscowLocalDateTimeToIso(date, hour, minute);

    return {
      available: new Date(startAt).getTime() > nowMs && !isExistingStart(bookings, startAt),
      endAt: this.addMinutesIso(startAt, eventType.durationMinutes),
      eventTypeId: eventType.id,
      startAt,
    };
  }
}
