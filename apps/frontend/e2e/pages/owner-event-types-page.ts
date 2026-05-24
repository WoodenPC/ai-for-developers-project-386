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
    return this.page.getByTestId("owner-event-type-row").filter({ hasText: title });
  }

  createButton() {
    return this.page.getByTestId("create-event-button");
  }

  eventIdError() {
    return this.page.getByTestId("event-id-error");
  }

  async openNewEventForm() {
    await this.page.getByTestId("new-event-button").click();
    await expect(this.page.getByRole("dialog", { name: "New event" })).toBeVisible();
  }

  async createEventType(values: EventTypeFormData) {
    await this.openNewEventForm();
    await this.fillEventTypeForm(values);
    await this.createButton().click();
  }

  async openEditForm(title: string) {
    await this.eventTypeRow(title).getByTestId("edit-event-button").click();
    await expect(this.page.getByRole("heading", { name: "Edit event" })).toBeVisible();
  }

  async saveEventType(values: EventTypeFormData) {
    await this.fillEventTypeForm(values);
    await this.page.getByTestId("save-event-button").click();
  }

  private async fillEventTypeForm(values: EventTypeFormData) {
    await this.page.getByLabel("Title").fill(values.title);
    await this.page.getByLabel("Description").fill(values.description);
    await this.page.getByLabel("Duration, minutes").fill(String(values.durationMinutes));
  }
}
