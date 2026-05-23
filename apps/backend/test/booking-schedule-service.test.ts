import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BookingScheduleService } from "../src/services/booking-schedule-service.js";
import type { Booking, EventType } from "../src/types.js";
import { fixedNow } from "./helpers.js";

const eventType: EventType = {
  description: "Quick alignment call.",
  durationMinutes: 30,
  id: 1,
  title: "Intro call",
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(fixedNow);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("BookingScheduleService", () => {
  it("generates a 14-day booking window in Moscow local time", () => {
    const service = new BookingScheduleService();

    const slots = service.listSlots(eventType, [], "2026-05-23");

    expect(slots).toHaveLength(84);
    expect(slots[0]).toEqual({
      available: true,
      endAt: "2026-05-23T06:30:00.000Z",
      eventTypeId: 1,
      startAt: "2026-05-23T06:00:00.000Z",
    });
    expect(slots[5]).toEqual({
      available: true,
      endAt: "2026-05-23T14:00:00.000Z",
      eventTypeId: 1,
      startAt: "2026-05-23T13:30:00.000Z",
    });
    expect(slots.at(-1)).toEqual({
      available: true,
      endAt: "2026-06-05T14:00:00.000Z",
      eventTypeId: 1,
      startAt: "2026-06-05T13:30:00.000Z",
    });
  });

  it("marks past and already booked slots unavailable", () => {
    const bookings: Booking[] = [
      {
        createdAt: "2026-05-22T00:00:00.000Z",
        endAt: "2026-05-23T07:00:00.000Z",
        eventTypeId: 1,
        eventTypeTitle: "Intro call",
        guestName: "Taylor Kim",
        id: "booking-1",
        startAt: "2026-05-23T06:30:00.000Z",
      },
    ];
    vi.setSystemTime(new Date("2026-05-23T06:00:00.000Z"));
    const service = new BookingScheduleService();

    const slots = service.listSlots(eventType, bookings, "2026-05-23");

    expect(slots[0]?.available).toBe(false);
    expect(slots[1]?.available).toBe(false);
    expect(slots[2]?.available).toBe(true);
  });

  it("offsets ISO datetimes", () => {
    const service = new BookingScheduleService();

    expect(service.addMinutesIso("2026-05-23T06:00:00.000Z", 45)).toBe("2026-05-23T06:45:00.000Z");
  });
});
