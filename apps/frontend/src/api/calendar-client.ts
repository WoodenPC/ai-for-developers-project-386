import type {
  Booking,
  EventType,
  Owner,
  OwnerApiCreateEventTypeRequest,
  OwnerApiUpdateEventTypeRequest,
  PublicCreateBookingRequest,
  Slot,
} from "@calls-calendar/api-dto/generated";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
const usesMockApi = import.meta.env.VITE_API_MODE === "mock";
let ownerEventTypesCache: EventType[] | undefined;

const today = () => new Date().toISOString().slice(0, 10);

export class CalendarApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
  ) {
    super(message);
    this.name = "CalendarApiError";
  }
}

function nextMockEventTypeId(eventTypes: EventType[]) {
  return Math.max(0, ...eventTypes.map((eventType) => eventType.id)) + Math.floor(Math.random() * 1000) + 1;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => undefined);
    const message =
      data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : `API request failed: ${response.status} ${response.statusText}`;

    throw new CalendarApiError(message, response.status, data);
  }

  return response.json() as Promise<T>;
}

export const calendarClient = {
  async getOwner(): Promise<Owner> {
    return request<Owner>("/owner");
  },
  async listEventTypes(): Promise<EventType[]> {
    return request<EventType[]>("/event-types");
  },
  async getEventType(eventTypeId: number): Promise<EventType> {
    return request<EventType>(`/event-types/${encodeURIComponent(String(eventTypeId))}`);
  },
  async listSlots(eventTypeId: number, fromDate = today()): Promise<Slot[]> {
    const query = new URLSearchParams({ fromDate });
    return request<Slot[]>(`/event-types/${encodeURIComponent(String(eventTypeId))}/slots?${query.toString()}`);
  },
  async createBooking(body: PublicCreateBookingRequest): Promise<Booking> {
    return request<Booking>("/bookings", {
      body: JSON.stringify(body),
      method: "POST",
    });
  },
  async listAllSlots(): Promise<Slot[]> {
    const eventTypes = await this.listEventTypes();
    const slotLists = await Promise.all(eventTypes.map((eventType) => this.listSlots(eventType.id)));
    return slotLists.flat();
  },
  async listUpcomingBookings(): Promise<Booking[]> {
    const bookings = await request<Booking[]>("/owner/bookings/upcoming");
    return [...bookings].sort(
      (left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime(),
    );
  },
  async listOwnerEventTypes(): Promise<EventType[]> {
    const eventTypes = await request<EventType[]>("/owner/event-types");

    if (!usesMockApi) {
      return eventTypes;
    }

    ownerEventTypesCache ??= eventTypes;
    return ownerEventTypesCache;
  },
  async getOwnerEventType(eventTypeId: number): Promise<EventType> {
    const cachedEventType = usesMockApi
      ? ownerEventTypesCache?.find((eventType) => eventType.id === eventTypeId)
      : undefined;

    if (cachedEventType) {
      return cachedEventType;
    }

    if (usesMockApi) {
      const eventTypes = await this.listOwnerEventTypes();
      const eventType = eventTypes.find((item) => item.id === eventTypeId);

      if (eventType) {
        return eventType;
      }
    }

    return request<EventType>(`/owner/event-types/${encodeURIComponent(String(eventTypeId))}`);
  },
  async createOwnerEventType(body: OwnerApiCreateEventTypeRequest): Promise<EventType> {
    const createdEventType = await request<EventType>("/owner/event-types", {
      body: JSON.stringify(body),
      method: "POST",
    });

    if (!usesMockApi) {
      return createdEventType;
    }

    const existingEventTypes = ownerEventTypesCache ?? [];
    const eventType = { ...createdEventType, ...body, id: nextMockEventTypeId(existingEventTypes) };

    ownerEventTypesCache = [...existingEventTypes, eventType];
    return eventType;
  },
  async updateOwnerEventType(eventTypeId: number, body: OwnerApiUpdateEventTypeRequest): Promise<EventType> {
    const updatedEventType = await request<EventType>(`/owner/event-types/${encodeURIComponent(String(eventTypeId))}`, {
      body: JSON.stringify(body),
      method: "PUT",
    });

    if (!usesMockApi) {
      return updatedEventType;
    }

    const eventType = { ...updatedEventType, ...body, id: eventTypeId };
    ownerEventTypesCache = (ownerEventTypesCache ?? []).map((item) => (item.id === eventTypeId ? eventType : item));
    return eventType;
  },
};
