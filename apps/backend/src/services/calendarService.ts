import { ApiError } from "../errors.js";
import type { CalendarRepository } from "../repositories/calendarRepository.js";
import type {
  Booking,
  EventType,
  EventTypeInput,
  OwnerApiCreateEventTypeRequest,
  OwnerApiUpdateEventTypeRequest,
  PublicCreateBookingRequest,
  Slot,
} from "../types.js";
import { addDays, addMinutesIso, isValidDateTime, moscowLocalDateTimeToIso, parseDateOnly } from "./dateUtils.js";

type Clock = () => Date;

const morningStart = { hour: 9, minute: 0 };
const morningEnd = { hour: 11, minute: 0 };
const afternoonStart = { hour: 16, minute: 30 };

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

function toMinutes(time: { hour: number; minute: number }) {
  return time.hour * 60 + time.minute;
}

function fromMinutes(value: number) {
  return {
    hour: Math.floor(value / 60),
    minute: value % 60,
  };
}

export class CalendarService {
  constructor(
    private readonly repository: CalendarRepository,
    private readonly clock: Clock = () => new Date(),
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
    const parsedDate = parseDateOnly(fromDate);

    if (!parsedDate) {
      throw new ApiError("invalid_from_date");
    }

    const bookings = this.repository.getBookings();
    const nowMs = this.clock().getTime();
    const slots: Slot[] = [];

    for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
      const date = addDays(parsedDate, dayOffset);
      const morningStartMinutes = toMinutes(morningStart);
      const morningEndMinutes = toMinutes(morningEnd);

      for (
        let startMinutes = morningStartMinutes;
        startMinutes <= morningEndMinutes;
        startMinutes += eventType.durationMinutes
      ) {
        const startTime = fromMinutes(startMinutes);
        slots.push(this.buildSlot(eventType, date, startTime.hour, startTime.minute, bookings, nowMs));
      }

      slots.push(this.buildSlot(eventType, date, afternoonStart.hour, afternoonStart.minute, bookings, nowMs));
    }

    return slots;
  }

  createBooking(input: PublicCreateBookingRequest) {
    if (
      !input ||
      !Number.isInteger(input.eventTypeId) ||
      typeof input.guestName !== "string" ||
      !input.guestName.trim() ||
      typeof input.startAt !== "string" ||
      !isValidDateTime(input.startAt)
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

    if (startMs <= this.clock().getTime()) {
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
      createdAt: this.clock().toISOString(),
      endAt: addMinutesIso(input.startAt, eventType.durationMinutes),
      eventTypeId: eventType.id,
      eventTypeTitle: eventType.title,
      guestName,
      id: this.repository.getNextBookingId(),
      startAt: input.startAt,
    };

    return this.repository.createBooking(booking);
  }

  listUpcomingBookings() {
    const nowMs = this.clock().getTime();

    return this.repository
      .getBookings()
      .filter((booking) => new Date(booking.startAt).getTime() > nowMs)
      .sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime());
  }

  private buildSlot(
    eventType: EventType,
    date: { day: number; month: number; year: number },
    hour: number,
    minute: number,
    bookings: Booking[],
    nowMs: number,
  ): Slot {
    const startAt = moscowLocalDateTimeToIso(date, hour, minute);

    return {
      available: new Date(startAt).getTime() > nowMs && !isExistingStart(bookings, startAt),
      endAt: addMinutesIso(startAt, eventType.durationMinutes),
      eventTypeId: eventType.id,
      startAt,
    };
  }
}
