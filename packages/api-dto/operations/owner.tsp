using TypeSpec.Http;

namespace CallsCalendar;

@tag("Owner")
namespace OwnerApi {
  model CreateEventTypeRequest {
    id: CallsCalendar.Identifier;
    title: string;
    description: string;
    durationMinutes: CallsCalendar.PositiveMinutes;
  }

  model CreatedEventTypeResponse {
    @statusCode statusCode: 201;
    @body eventType: CallsCalendar.EventType;
  }

  @doc("Returns the predefined calendar owner profile.")
  @get
  @route("/owner")
  op getOwner(): CallsCalendar.Owner;

  @doc("Creates an event type for the predefined owner calendar.")
  @post
  @route("/owner/event-types")
  op createEventType(
    @body body: CreateEventTypeRequest,
  ): CreatedEventTypeResponse | CallsCalendar.BadRequestResponse | CallsCalendar.ConflictResponse;

  @doc("Lists upcoming bookings for all event types in one startAt-ordered list.")
  @get
  @route("/owner/bookings/upcoming")
  op listUpcomingBookings(): CallsCalendar.Booking[];
}
