import type { Page } from "@playwright/test";

export function localDateString(daysFromToday: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function selectFutureDate(page: Page, daysFromToday: number) {
  const dateString = localDateString(daysFromToday);
  await page.locator(`[data-testid="booking-calendar-day"][data-date="${dateString}"]`).click();
}
