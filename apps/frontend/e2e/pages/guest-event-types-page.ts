import { expect, type Page } from "@playwright/test";

export class GuestEventTypesPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
    await expect(this.page.getByRole("heading", { name: "Choose call type" })).toBeVisible();
  }

  eventTypeLink(title: string | RegExp) {
    return this.page.getByTestId("guest-event-type-link").filter({ hasText: title });
  }

  ownerEmail(email: string) {
    return this.page.getByTestId("guest-owner-email").filter({ hasText: email });
  }

  ownerHeading(name: string) {
    return this.page.getByRole("heading", { name });
  }

  async openEventType(title: string | RegExp) {
    await this.eventTypeLink(title).click();
  }
}
