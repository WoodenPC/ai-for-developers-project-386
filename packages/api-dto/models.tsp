namespace CallsCalendar;

alias Identifier = string;
alias PositiveMinutes = int32;

@doc("A single predefined calendar owner profile. The owner is not created, selected, or authenticated through the API.")
model Owner {
  id: Identifier;
  name: string;
  email: string;
}

@doc("A type of meeting that guests can book.")
model EventType {
  id: Identifier;
  title: string;
  description: string;
  durationMinutes: PositiveMinutes;
}

@doc("A potential booking time for a selected event type.")
model Slot {
  eventTypeId: Identifier;
  startAt: utcDateTime;
  endAt: utcDateTime;

  @doc("True only when the slot can be booked by a guest.")
  available: boolean;
}

@doc("A guest booking. Guests do not have accounts and are identified only by the provided name.")
model Booking {
  id: Identifier;
  eventTypeId: Identifier;
  eventTypeTitle: string;
  guestName: string;
  startAt: utcDateTime;
  endAt: utcDateTime;
  createdAt: utcDateTime;
}
