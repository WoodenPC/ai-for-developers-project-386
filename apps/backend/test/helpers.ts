import { InMemoryCalendarRepository } from "../src/repositories/calendar-repository.js";
import { seedEventTypes, seedOwner } from "../src/repositories/seed-data.js";
import { BookingScheduleService } from "../src/services/booking-schedule-service.js";
import { CalendarService } from "../src/services/calendar-service.js";
import type { Booking } from "../src/types.js";

export const fixedNow = new Date("2026-05-22T00:00:00.000Z");

export function createTestRepository(bookings: Booking[] = []) {
  return new InMemoryCalendarRepository({
    bookings,
    eventTypes: seedEventTypes,
    owner: seedOwner,
  });
}

export function createTestService(bookings: Booking[] = []) {
  return new CalendarService(createTestRepository(bookings), new BookingScheduleService());
}
