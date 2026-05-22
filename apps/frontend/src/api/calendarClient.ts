import type { Booking, EventType, Owner, Slot } from "@calls-calendar/api-dto/generated";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

const today = () => new Date().toISOString().slice(0, 10);

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
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
  async listSlots(eventTypeId: string): Promise<Slot[]> {
    const query = new URLSearchParams({ fromDate: today() });
    return request<Slot[]>(`/event-types/${encodeURIComponent(eventTypeId)}/slots?${query.toString()}`);
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
};
