import type { Slot } from "@calls-calendar/api-dto/generated";

export function isPastSlot(slot: Slot) {
  return new Date(slot.startAt).getTime() <= Date.now();
}
