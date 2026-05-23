import type {
  Booking,
  EventType,
  Owner,
  OwnerApiCreateEventTypeRequest,
  OwnerApiUpdateEventTypeRequest,
  PublicCreateBookingRequest,
  Slot,
} from "@calls-calendar/api-dto/generated";

export type {
  Booking,
  EventType,
  Owner,
  OwnerApiCreateEventTypeRequest,
  OwnerApiUpdateEventTypeRequest,
  PublicCreateBookingRequest,
  Slot,
};

export type EventTypeInput = OwnerApiCreateEventTypeRequest | OwnerApiUpdateEventTypeRequest;
