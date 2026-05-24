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
    await this.page
      .getByRole("button", { name: /\d{1,2}:\d{2}\s[AP]M - \d{1,2}:\d{2}\s[AP]M/ })
      .filter({ hasNotText: /Past|Taken/ })
      .first()
      .click();
  }

  async fillGuestName(name: string) {
    await this.page.getByLabel("Your name").fill(name);
  }

  async confirmBooking() {
    await this.page.getByRole("button", { name: "Confirm booking" }).click();
  }

  confirmationMessage() {
    return this.page.getByText(/Confirmed for/);
  }

  eventIdError() {
    return this.page.getByText("Event id must be a positive number.");
  }
}
