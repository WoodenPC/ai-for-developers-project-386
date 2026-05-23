import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance } from "fastify";
import { createApp } from "../src/app.js";
import { fixedNow } from "./helpers.js";

let app: FastifyInstance | undefined;

async function createReadyApp() {
  app = createApp();
  await app.ready();
  return app;
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(fixedNow);
});

afterEach(async () => {
  await app?.close();
  app = undefined;
  vi.useRealTimers();
});

describe("backend routes", () => {
  it("serves owner profile", async () => {
    const readyApp = await createReadyApp();

    const response = await readyApp.inject({ method: "GET", url: "/owner" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      email: "alex.morgan@example.com",
      id: "owner-main",
      name: "Alex Morgan",
    });
  });

  it("maps route validation errors to contract error responses", async () => {
    const readyApp = await createReadyApp();

    const response = await readyApp.inject({
      method: "POST",
      payload: {
        description: "Missing valid duration.",
        durationMinutes: 0,
        title: "Bad event",
      },
      url: "/owner/event-types",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      code: "invalid_event_type",
      message: "Event type request is invalid.",
    });
  });

  it("creates bookings and returns slot conflicts in contract shape", async () => {
    const readyApp = await createReadyApp();
    const payload = {
      eventTypeId: 1,
      guestName: "Taylor Kim",
      startAt: "2026-05-23T06:00:00.000Z",
    };

    const created = await readyApp.inject({
      method: "POST",
      payload,
      url: "/bookings",
    });
    const conflict = await readyApp.inject({
      method: "POST",
      payload,
      url: "/bookings",
    });

    expect(created.statusCode).toBe(201);
    expect(created.json()).toMatchObject({
      eventTypeId: 1,
      guestName: "Taylor Kim",
      startAt: "2026-05-23T06:00:00.000Z",
    });
    expect(conflict.statusCode).toBe(409);
    expect(conflict.json()).toEqual({
      code: "slot_taken",
      message: "Requested slot is already booked.",
    });
  });

  it("returns invalid_from_date for malformed slot queries", async () => {
    const readyApp = await createReadyApp();

    for (const fromDate of ["not-date", "2026-02-31"]) {
      const response = await readyApp.inject({
        method: "GET",
        url: `/event-types/1/slots?fromDate=${fromDate}`,
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        code: "invalid_from_date",
        message: "fromDate must be a valid calendar date.",
      });
    }
  });

  it("returns invalid_booking for malformed booking datetimes", async () => {
    const readyApp = await createReadyApp();

    const response = await readyApp.inject({
      method: "POST",
      payload: {
        eventTypeId: 1,
        guestName: "Taylor Kim",
        startAt: "not-date",
      },
      url: "/bookings",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      code: "invalid_booking",
      message: "Booking request is invalid.",
    });
  });
});
