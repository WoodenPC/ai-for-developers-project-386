import { expect, type Page } from "@playwright/test";

type EventTypeFormData = {
  description: string;
  durationMinutes: number | string;
  title: string;
};

export class OwnerEventTypesPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/owner/event-types");
    await expect(this.page.getByRole("heading", { name: "Event types" })).toBeVisible();
  }

  async gotoInvalidEditRoute() {
    await this.page.goto("/owner/event-types/not-a-number/edit");
  }

  eventTypeRow(title: string) {
    return this.page.locator(".eventTypeRow").filter({ hasText: title });
  }

  createButton() {
    return this.page.getByRole("button", { name: "Create event" });
  }

  eventIdError() {
    return this.page.getByText("Event id must be a positive number.");
  }

  async openNewEventForm() {
    await this.page.getByRole("button", { name: "New event" }).click();
    await expect(this.page.getByRole("dialog", { name: "New event" })).toBeVisible();
  }

  async createEventType(values: EventTypeFormData) {
    await this.openNewEventForm();
    await this.fillEventTypeForm(values);
    await this.createButton().click();
  }

  async openEditForm(title: string) {
    await this.eventTypeRow(title).getByRole("button", { name: "Edit" }).click();
    await expect(this.page.getByRole("heading", { name: "Edit event" })).toBeVisible();
  }

  async saveEventType(values: EventTypeFormData) {
    await this.fillEventTypeForm(values);
    await this.page.getByRole("button", { name: "Save changes" }).click();
  }

  private async fillEventTypeForm(values: EventTypeFormData) {
    await this.page.getByLabel("Title").fill(values.title);
    await this.page.getByLabel("Description").fill(values.description);
    await this.page.getByLabel("Duration, minutes").fill(String(values.durationMinutes));
  }
}
