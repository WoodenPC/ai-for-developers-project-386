import type { EventType, Owner } from "../types.js";

export const seedOwner: Owner = {
  email: "alex.morgan@example.com",
  id: "owner-main",
  name: "Alex Morgan",
};

export const seedEventTypes: EventType[] = [
  {
    description: "Quick alignment call for new requests and project fit.",
    durationMinutes: 30,
    id: 1,
    title: "Intro call",
  },
  {
    description: "A structured review for roadmap, blockers, and next actions.",
    durationMinutes: 45,
    id: 2,
    title: "Delivery review",
  },
  {
    description: "Focused time for architecture, API design, or implementation details.",
    durationMinutes: 60,
    id: 3,
    title: "Technical session",
  },
];

