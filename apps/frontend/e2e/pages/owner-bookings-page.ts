import { expect, type Page } from "@playwright/test";

export class OwnerBookingsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/owner/bookings");
    await expect(this.page.getByRole("heading", { exact: true, name: "Bookings" })).toBeVisible();
  }

  bookingRow(guestName: string) {
    return this.page.getByTestId("owner-booking-row").filter({ hasText: guestName });
  }
}
