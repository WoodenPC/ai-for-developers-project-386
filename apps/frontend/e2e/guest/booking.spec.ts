import { expect, test } from "@playwright/test";

import { GuestBookingPage } from "../pages/guest-booking-page";
import { seedEventTypes, uniqueSuffix } from "../support/test-data";

test("guest books an available future slot", async ({ page }) => {
  const guestBookingPage = new GuestBookingPage(page);
  const guestName = `Taylor Kim ${uniqueSuffix()}`;

  await guestBookingPage.goto(seedEventTypes.introCall.id);
  await guestBookingPage.selectFutureDate(1);
  await guestBookingPage.selectFirstAvailableSlot();
  await guestBookingPage.fillGuestName(guestName);
  await guestBookingPage.confirmBooking();

  await expect(guestBookingPage.confirmationMessage()).toBeVisible();
});

test("invalid guest event type route shows event id validation", async ({ page }) => {
  const guestBookingPage = new GuestBookingPage(page);

  await guestBookingPage.gotoInvalidEventType();

  await expect(guestBookingPage.eventIdError()).toBeVisible();
});
