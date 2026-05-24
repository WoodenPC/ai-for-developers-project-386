import { expect, test } from "@playwright/test";

import { GuestEventTypesPage } from "../pages/guest-event-types-page";
import { OwnerEventTypesPage } from "../pages/owner-event-types-page";
import { uniqueSuffix } from "../support/test-data";

test("owner creates event type and guests can see it", async ({ page }) => {
  const ownerEventTypesPage = new OwnerEventTypesPage(page);
  const guestEventTypesPage = new GuestEventTypesPage(page);
  const title = `Strategy call ${uniqueSuffix()}`;
  const description = "Planning session for e2e coverage.";

  await ownerEventTypesPage.goto();
  await ownerEventTypesPage.createEventType({
    description,
    durationMinutes: 25,
    title,
  });

  const createdRow = ownerEventTypesPage.eventTypeRow(title);
  await expect(createdRow).toBeVisible();
  await expect(createdRow).toContainText(description);
  await expect(createdRow).toContainText("25 min");

  await guestEventTypesPage.goto();

  await expect(guestEventTypesPage.eventTypeLink(new RegExp(title))).toBeVisible();
});

test("owner edits event type", async ({ page }) => {
  const ownerEventTypesPage = new OwnerEventTypesPage(page);
  const initialTitle = `Review call ${uniqueSuffix()}`;
  const editedTitle = `Review call updated ${uniqueSuffix()}`;
  const editedDescription = "Updated review agenda for roadmap and risks.";

  await ownerEventTypesPage.goto();
  await ownerEventTypesPage.createEventType({
    description: "Review call before edit.",
    durationMinutes: 40,
    title: initialTitle,
  });
  await ownerEventTypesPage.openEditForm(initialTitle);
  await ownerEventTypesPage.saveEventType({
    description: editedDescription,
    durationMinutes: 50,
    title: editedTitle,
  });

  const editedRow = ownerEventTypesPage.eventTypeRow(editedTitle);
  await expect(page).toHaveURL(/\/owner\/event-types\/?$/);
  await expect(editedRow).toBeVisible();
  await expect(editedRow).toContainText(editedDescription);
  await expect(editedRow).toContainText("50 min");
});

test("owner event type validation and invalid route are visible", async ({ page }) => {
  const ownerEventTypesPage = new OwnerEventTypesPage(page);

  await ownerEventTypesPage.gotoInvalidEditRoute();
  await expect(ownerEventTypesPage.eventIdError()).toBeVisible();

  await ownerEventTypesPage.goto();
  await ownerEventTypesPage.openNewEventForm();

  await expect(ownerEventTypesPage.createButton()).toBeDisabled();
});
