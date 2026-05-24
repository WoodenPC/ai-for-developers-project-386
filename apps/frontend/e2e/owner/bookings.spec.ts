import { expect, test } from "@playwright/test";

import { GuestBookingPage } from "../pages/guest-booking-page";
import { OwnerBookingsPage } from "../pages/owner-bookings-page";
import { seedEventTypes, uniqueSuffix } from "../support/test-data";

test("owner sees a booking created by a guest", async ({ page }) => {
  const guestBookingPage = new GuestBookingPage(page);
  const ownerBookingsPage = new OwnerBookingsPage(page);
  const guestName = `Morgan Guest ${uniqueSuffix()}`;

  await guestBookingPage.goto(seedEventTypes.introCall.id);
  await guestBookingPage.selectFutureDate(1);
  await guestBookingPage.selectFirstAvailableSlot();
  await guestBookingPage.fillGuestName(guestName);
  await guestBookingPage.confirmBooking();
  await expect(guestBookingPage.confirmationMessage()).toBeVisible();

  await ownerBookingsPage.goto();

  const bookingRow = ownerBookingsPage.bookingRow(guestName);
  await expect(bookingRow).toBeVisible();
  await expect(bookingRow).toContainText(seedEventTypes.introCall.title);
});
