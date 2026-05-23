namespace CallsCalendar;

alias Identifier = string;
alias EventTypeId = int32;

@minLength(1)
scalar NonEmptyString extends string;

@minValue(1)
scalar PositiveMinutes extends int32;

@doc("A single predefined calendar owner profile. The owner is not created, selected, or authenticated through the API.")
model Owner {
  id: Identifier;
  name: NonEmptyString;
  email: NonEmptyString;
}

@doc("A type of meeting that guests can book.")
model EventType {
  id: EventTypeId;
  title: NonEmptyString;
  description: NonEmptyString;
  durationMinutes: PositiveMinutes;
}

@doc("A potential booking time for a selected event type.")
model Slot {
  eventTypeId: EventTypeId;
  startAt: utcDateTime;
  endAt: utcDateTime;

  @doc("True only when the slot can be booked by a guest.")
  available: boolean;
}

@doc("A guest booking. Guests do not have accounts and are identified only by the provided name.")
model Booking {
  id: Identifier;
  eventTypeId: EventTypeId;
  eventTypeTitle: NonEmptyString;
  guestName: NonEmptyString;
  startAt: utcDateTime;
  endAt: utcDateTime;
  createdAt: utcDateTime;
}
