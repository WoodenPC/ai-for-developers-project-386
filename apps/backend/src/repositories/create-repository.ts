import { InMemoryCalendarRepository } from "./calendar-repository.js";
import { seedEventTypes, seedOwner } from "./seed-data.js";

export function createDefaultRepository() {
  return new InMemoryCalendarRepository({
    eventTypes: seedEventTypes,
    owner: seedOwner,
  });
}
