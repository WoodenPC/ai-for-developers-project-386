import { InMemoryCalendarRepository } from "./calendarRepository.js";
import { seedEventTypes, seedOwner } from "./seedData.js";

export function createDefaultRepository() {
  return new InMemoryCalendarRepository({
    eventTypes: seedEventTypes,
    owner: seedOwner,
  });
}
