import type { Booking, EventType, Owner } from "../types.js";

export interface CalendarRepository {
  createBooking(booking: Booking): Booking;
  createEventType(eventType: EventType): EventType;
  getBookings(): Booking[];
  getEventType(eventTypeId: number): EventType | undefined;
  getEventTypes(): EventType[];
  getNextBookingId(): string;
  getNextEventTypeId(): number;
  getOwner(): Owner;
  updateEventType(eventType: EventType): EventType;
}

export class InMemoryCalendarRepository implements CalendarRepository {
  private readonly owner: Owner;
  private eventTypes: EventType[];
  private bookings: Booking[];
  private nextEventTypeId: number;
  private nextBookingNumber: number;

  constructor({
    bookings = [],
    eventTypes,
    owner,
  }: {
    bookings?: Booking[];
    eventTypes: EventType[];
    owner: Owner;
  }) {
    this.owner = { ...owner };
    this.eventTypes = eventTypes.map((eventType) => ({ ...eventType }));
    this.bookings = bookings.map((booking) => ({ ...booking }));
    this.nextEventTypeId = Math.max(0, ...this.eventTypes.map((eventType) => eventType.id)) + 1;
    this.nextBookingNumber = this.bookings.length + 1;
  }

  getOwner() {
    return { ...this.owner };
  }

  getEventTypes() {
    return this.eventTypes.map((eventType) => ({ ...eventType }));
  }

  getEventType(eventTypeId: number) {
    const eventType = this.eventTypes.find((item) => item.id === eventTypeId);
    return eventType ? { ...eventType } : undefined;
  }

  createEventType(eventType: EventType) {
    this.eventTypes = [...this.eventTypes, { ...eventType }];
    return { ...eventType };
  }

  updateEventType(eventType: EventType) {
    this.eventTypes = this.eventTypes.map((item) => (item.id === eventType.id ? { ...eventType } : item));
    return { ...eventType };
  }

  getBookings() {
    return this.bookings.map((booking) => ({ ...booking }));
  }

  createBooking(booking: Booking) {
    this.bookings = [...this.bookings, { ...booking }];
    return { ...booking };
  }

  getNextEventTypeId() {
    return this.nextEventTypeId++;
  }

  getNextBookingId() {
    return `booking-${this.nextBookingNumber++}`;
  }
}
