export const seedOwner = {
  email: "alex.morgan@example.com",
  name: "Alex Morgan",
};

export const seedEventTypes = {
  deliveryReview: {
    description: "A structured review for roadmap, blockers, and next actions.",
    durationMinutes: 45,
    title: "Delivery review",
  },
  introCall: {
    description: "Quick alignment call for new requests and project fit.",
    durationMinutes: 30,
    id: 1,
    title: "Intro call",
  },
  technicalSession: {
    description: "Focused time for architecture, API design, or implementation details.",
    durationMinutes: 60,
    title: "Technical session",
  },
};

export function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
