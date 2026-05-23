import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../src/errors.js";
import { createTestRepository, createTestService, fixedNow } from "./helpers.js";
import { BookingScheduleService } from "../src/services/booking-schedule-service.js";
import { CalendarService } from "../src/services/calendar-service.js";
import type { Booking } from "../src/types.js";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(fixedNow);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("CalendarService event types", () => {
  it("creates event types with trimmed fields and the next id", () => {
    const service = createTestService();

    const eventType = service.createEventType({
      description: " Planning session ",
      durationMinutes: 45,
      title: " Strategy call ",
    });

    expect(eventType).toEqual({
      description: "Planning session",
      durationMinutes: 45,
      id: 4,
      title: "Strategy call",
    });
  });

  it("rejects duplicate titles case-insensitively", () => {
    const service = createTestService();

    expect(() =>
      service.createEventType({
        description: "Another intro.",
        durationMinutes: 30,
        title: " intro call ",
      }),
    ).toThrowError(new ApiError("event_type_exists"));
  });

  it("updates existing event types", () => {
    const service = createTestService();

    const eventType = service.updateEventType(1, {
      description: "Updated description.",
      durationMinutes: 60,
      title: "Updated intro",
    });

    expect(eventType).toEqual({
      description: "Updated description.",
      durationMinutes: 60,
      id: 1,
      title: "Updated intro",
    });
  });
});

describe("CalendarService slots and bookings", () => {
  it("generates a 14-day slot window using the mock schedule", () => {
    const service = createTestService();

    const slots = service.listSlots(1, "2026-05-23");

    expect(slots).toHaveLength(84);
    expect(slots.slice(0, 6)).toEqual([
      {
        available: true,
        endAt: "2026-05-23T06:30:00.000Z",
        eventTypeId: 1,
        startAt: "2026-05-23T06:00:00.000Z",
      },
      {
        available: true,
        endAt: "2026-05-23T07:00:00.000Z",
        eventTypeId: 1,
        startAt: "2026-05-23T06:30:00.000Z",
      },
      {
        available: true,
        endAt: "2026-05-23T07:30:00.000Z",
        eventTypeId: 1,
        startAt: "2026-05-23T07:00:00.000Z",
      },
      {
        available: true,
        endAt: "2026-05-23T08:00:00.000Z",
        eventTypeId: 1,
        startAt: "2026-05-23T07:30:00.000Z",
      },
      {
        available: true,
        endAt: "2026-05-23T08:30:00.000Z",
        eventTypeId: 1,
        startAt: "2026-05-23T08:00:00.000Z",
      },
      {
        available: true,
        endAt: "2026-05-23T14:00:00.000Z",
        eventTypeId: 1,
        startAt: "2026-05-23T13:30:00.000Z",
      },
    ]);
  });

  it("marks booked slots unavailable and rejects duplicate startAt across event types", () => {
    const repository = createTestRepository();
    const service = new CalendarService(repository, new BookingScheduleService());

    const booking = service.createBooking({
      eventTypeId: 1,
      guestName: " Taylor Kim ",
      startAt: "2026-05-23T06:00:00.000Z",
    });

    expect(booking).toMatchObject({
      createdAt: "2026-05-22T00:00:00.000Z",
      endAt: "2026-05-23T06:30:00.000Z",
      eventTypeId: 1,
      eventTypeTitle: "Intro call",
      guestName: "Taylor Kim",
      id: "booking-1",
      startAt: "2026-05-23T06:00:00.000Z",
    });
    expect(service.listSlots(1, "2026-05-23")[0]?.available).toBe(false);
    expect(() =>
      service.createBooking({
        eventTypeId: 2,
        guestName: "Jordan Lee",
        startAt: "2026-05-23T06:00:00.000Z",
      }),
    ).toThrowError(new ApiError("slot_taken"));
  });

  it("rejects missing slots", () => {
    const service = createTestService();

    expect(() =>
      service.createBooking({
        eventTypeId: 1,
        guestName: "Taylor Kim",
        startAt: "2026-05-23T12:00:00.000Z",
      }),
    ).toThrowError(new ApiError("slot_not_found"));
  });

  it("lists only upcoming bookings sorted by start time", () => {
    const bookings: Booking[] = [
      {
        createdAt: "2026-05-20T00:00:00.000Z",
        endAt: "2026-05-23T07:30:00.000Z",
        eventTypeId: 1,
        eventTypeTitle: "Intro call",
        guestName: "Second",
        id: "booking-2",
        startAt: "2026-05-23T07:00:00.000Z",
      },
      {
        createdAt: "2026-05-20T00:00:00.000Z",
        endAt: "2026-05-21T07:30:00.000Z",
        eventTypeId: 1,
        eventTypeTitle: "Intro call",
        guestName: "Past",
        id: "booking-past",
        startAt: "2026-05-21T07:00:00.000Z",
      },
      {
        createdAt: "2026-05-20T00:00:00.000Z",
        endAt: "2026-05-23T06:30:00.000Z",
        eventTypeId: 1,
        eventTypeTitle: "Intro call",
        guestName: "First",
        id: "booking-1",
        startAt: "2026-05-23T06:00:00.000Z",
      },
    ];
    const service = createTestService(bookings);

    expect(service.listUpcomingBookings().map((booking) => booking.id)).toEqual(["booking-1", "booking-2"]);
  });
});
