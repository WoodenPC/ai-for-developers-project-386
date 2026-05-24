import type { Page } from "@playwright/test";

export function localDateString(daysFromToday: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calendarButtonName(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const monthName = new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(year, month - 1, day));

  return `${day} ${monthName} ${year}`;
}

export async function selectFutureDate(page: Page, daysFromToday: number) {
  const dateString = localDateString(daysFromToday);
  await page.getByRole("button", { name: calendarButtonName(dateString) }).click();
}
