import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contractSchemas } from "../src/generated/contractSchemas.js";

const implementedOperationIds = [
  "OwnerApi_getOwner",
  "OwnerApi_listEventTypes",
  "OwnerApi_getEventType",
  "OwnerApi_createEventType",
  "OwnerApi_updateEventType",
  "OwnerApi_listUpcomingBookings",
  "Public_listEventTypes",
  "Public_getEventType",
  "Public_listSlots",
  "Public_createBooking",
] as const;

describe("generated contract schemas", () => {
  it("includes schemas for every implemented OpenAPI operation", () => {
    expect(Object.keys(contractSchemas).sort()).toEqual([...implementedOperationIds].sort());
  });

  it("keeps route validation wired to generated contract schemas", async () => {
    const routeFiles = [
      "src/routes/owner/bookings.ts",
      "src/routes/owner/event-types.ts",
      "src/routes/owner/profile.ts",
      "src/routes/public/bookings.ts",
      "src/routes/public/event-types.ts",
    ];
    const routeSources = await Promise.all(
      routeFiles.map((filePath) => readFile(path.join(process.cwd(), filePath), "utf8")),
    );

    expect(routeSources.every((source) => source.includes("../../generated/contractSchemas.js"))).toBe(true);
    expect(routeSources.every((source) => !source.includes("../../schemas/"))).toBe(true);
  });
});
