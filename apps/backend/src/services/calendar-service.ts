import { ApiError } from "../errors.js";
import type { CalendarRepository } from "../repositories/calendar-repository.js";
import type {
  Booking,
  EventType,
  EventTypeInput,
  OwnerApiCreateEventTypeRequest,
  OwnerApiUpdateEventTypeRequest,
  PublicCreateBookingRequest,
} from "../types.js";
import { BookingScheduleService } from "./booking-schedule-service.js";

function normalizeEventTypeInput(input: EventTypeInput) {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const durationMinutes = input.durationMinutes;

  if (!title || !description || !Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    throw new ApiError("invalid_event_type");
  }

  return { description, durationMinutes, title };
}

function isSameTitle(left: string, right: string) {
  return left.trim().toLocaleLowerCase("en-US") === right.trim().toLocaleLowerCase("en-US");
}

function isExistingStart(bookings: Booking[], startAt: string) {
  return bookings.some((booking) => booking.startAt === startAt);
}

export class CalendarService {
  constructor(
    private readonly repository: CalendarRepository,
    private readonly scheduleService: BookingScheduleService = new BookingScheduleService(),
  ) {}

  getOwner() {
    return this.repository.getOwner();
  }

  listEventTypes() {
    return this.repository.getEventTypes();
  }

  getEventType(eventTypeId: number) {
    const eventType = this.repository.getEventType(eventTypeId);

    if (!eventType) {
      throw new ApiError("event_type_not_found");
    }

    return eventType;
  }

  createEventType(input: OwnerApiCreateEventTypeRequest) {
    const normalizedInput = normalizeEventTypeInput(input);
    const duplicate = this.repository
      .getEventTypes()
      .some((eventType) => isSameTitle(eventType.title, normalizedInput.title));

    if (duplicate) {
      throw new ApiError("event_type_exists");
    }

    const eventType: EventType = {
      ...normalizedInput,
      id: this.repository.getNextEventTypeId(),
    };

    return this.repository.createEventType(eventType);
  }

  updateEventType(eventTypeId: number, input: OwnerApiUpdateEventTypeRequest) {
    this.getEventType(eventTypeId);
    const normalizedInput = normalizeEventTypeInput(input);

    const eventType: EventType = {
      ...normalizedInput,
      id: eventTypeId,
    };

    return this.repository.updateEventType(eventType);
  }

  listSlots(eventTypeId: number, fromDate: string) {
    const eventType = this.getEventType(eventTypeId);
    const bookings = this.repository.getBookings();
    return this.scheduleService.listSlots(eventType, bookings, fromDate);
  }

  createBooking(input: PublicCreateBookingRequest) {
    if (
      !input ||
      !Number.isInteger(input.eventTypeId) ||
      typeof input.guestName !== "string" ||
      !input.guestName.trim() ||
      typeof input.startAt !== "string"
    ) {
      throw new ApiError("invalid_booking");
    }

    const eventType = this.getEventType(input.eventTypeId);
    const guestName = input.guestName.trim();
    const bookings = this.repository.getBookings();

    if (isExistingStart(bookings, input.startAt)) {
      throw new ApiError("slot_taken");
    }

    const startMs = new Date(input.startAt).getTime();

    if (startMs <= new Date().getTime()) {
      throw new ApiError("slot_not_found");
    }

    const fromDate = input.startAt.slice(0, 10);
    const slots = this.listSlots(eventType.id, fromDate);
    const slot = slots.find((item) => item.startAt === input.startAt);

    if (!slot) {
      throw new ApiError("slot_not_found");
    }

    if (!slot.available) {
      throw new ApiError("slot_taken");
    }

    const booking: Booking = {
      createdAt: new Date().toISOString(),
      endAt: this.scheduleService.addMinutesIso(input.startAt, eventType.durationMinutes),
      eventTypeId: eventType.id,
      eventTypeTitle: eventType.title,
      guestName,
      id: this.repository.getNextBookingId(),
      startAt: input.startAt,
    };

    return this.repository.createBooking(booking);
  }

  listUpcomingBookings() {
    const nowMs = new Date().getTime();

    return this.repository
      .getBookings()
      .filter((booking) => new Date(booking.startAt).getTime() > nowMs)
      .sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime());
  }
}
