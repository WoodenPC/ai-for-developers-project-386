import { expect, type Page } from "@playwright/test";

import { selectFutureDate } from "../support/date-picker";

export class GuestBookingPage {
  constructor(private readonly page: Page) {}

  async goto(eventTypeId: number | string) {
    await this.page.goto(`/event-types/${eventTypeId}`);
    await expect(this.page.getByRole("heading", { name: "Book a call" })).toBeVisible();
  }

  async gotoInvalidEventType() {
    await this.page.goto("/event-types/not-a-number");
  }

  async selectFutureDate(daysFromToday: number) {
    await selectFutureDate(this.page, daysFromToday);
  }

  async selectFirstAvailableSlot() {
    await this.page.locator('[data-testid="booking-slot-option"][data-slot-state="available"]').first().click();
  }

  async fillGuestName(name: string) {
    await this.page.getByTestId("guest-name-input").fill(name);
  }

  async confirmBooking() {
    await this.page.getByTestId("confirm-booking-button").click();
  }

  confirmationMessage() {
    return this.page.getByTestId("booking-confirmation");
  }

  eventTypeSummary() {
    return this.page.getByTestId("booking-event-type-summary");
  }

  eventIdError() {
    return this.page.getByTestId("event-id-error");
  }
}
