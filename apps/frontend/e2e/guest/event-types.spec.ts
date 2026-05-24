import { expect, test } from "@playwright/test";

import { GuestEventTypesPage } from "../pages/guest-event-types-page";
import { seedEventTypes, seedOwner } from "../support/test-data";

test("guest discovers event types and opens booking page", async ({ page }) => {
  const guestEventTypesPage = new GuestEventTypesPage(page);

  await guestEventTypesPage.goto();

  await expect(guestEventTypesPage.ownerHeading(seedOwner.name)).toBeVisible();
  await expect(guestEventTypesPage.ownerEmail(seedOwner.email)).toBeVisible();
  await expect(guestEventTypesPage.eventTypeLink(seedEventTypes.introCall.title)).toBeVisible();
  await expect(guestEventTypesPage.eventTypeLink(seedEventTypes.deliveryReview.title)).toBeVisible();
  await expect(guestEventTypesPage.eventTypeLink(seedEventTypes.technicalSession.title)).toBeVisible();

  await guestEventTypesPage.openEventType(seedEventTypes.introCall.title);

  await expect(page).toHaveURL(new RegExp(`/event-types/${seedEventTypes.introCall.id}$`));
  await expect(page.getByRole("heading", { name: "Book a call" })).toBeVisible();
  await expect(page.getByText(seedEventTypes.introCall.description)).toBeVisible();
  await expect(page.getByText(`${seedEventTypes.introCall.durationMinutes} min`)).toBeVisible();
});
