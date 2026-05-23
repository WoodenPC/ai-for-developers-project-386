export const calendarQueryKeyParts = {
  bookings: "bookings",
  eventTypes: "eventTypes",
  owner: "owner",
  slots: "slots",
} as const;

export const calendarQueryKeys = {
  eventTypes: [calendarQueryKeyParts.eventTypes],
  eventType: (eventTypeId: number) => [calendarQueryKeyParts.eventTypes, eventTypeId] as const,
  owner: [calendarQueryKeyParts.owner],
  ownerBookings: [calendarQueryKeyParts.owner, calendarQueryKeyParts.bookings],
  ownerEventType: (eventTypeId: number) =>
    [calendarQueryKeyParts.owner, calendarQueryKeyParts.eventTypes, eventTypeId] as const,
  ownerEventTypes: [calendarQueryKeyParts.owner, calendarQueryKeyParts.eventTypes],
  slots: (eventTypeId: number | undefined, fromDate?: string) =>
    [calendarQueryKeyParts.slots, eventTypeId, fromDate] as const,
} as const;
