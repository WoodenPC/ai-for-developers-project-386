using TypeSpec.Http;

namespace CallsCalendar;

@tag("Owner")
namespace OwnerApi {
  model CreateEventTypeRequest {
    title: CallsCalendar.NonEmptyString;
    description: CallsCalendar.NonEmptyString;
    durationMinutes: CallsCalendar.PositiveMinutes;
  }

  model UpdateEventTypeRequest {
    title: CallsCalendar.NonEmptyString;
    description: CallsCalendar.NonEmptyString;
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

  @doc("Lists event types managed by the predefined owner calendar.")
  @get
  @route("/owner/event-types")
  op listEventTypes(): CallsCalendar.EventType[];

  @doc("Returns an event type managed by the predefined owner calendar.")
  @get
  @route("/owner/event-types/{eventTypeId}")
  op getEventType(
    @path eventTypeId: CallsCalendar.EventTypeId,
  ): CallsCalendar.EventType | CallsCalendar.NotFoundResponse;

  @doc("Creates an event type for the predefined owner calendar.")
  @post
  @route("/owner/event-types")
  op createEventType(
    @body body: CreateEventTypeRequest,
  ): CreatedEventTypeResponse | CallsCalendar.BadRequestResponse | CallsCalendar.ConflictResponse;

  @doc("Updates an event type for the predefined owner calendar.")
  @put
  @route("/owner/event-types/{eventTypeId}")
  op updateEventType(
    @path eventTypeId: CallsCalendar.EventTypeId,
    @body body: UpdateEventTypeRequest,
  ): CallsCalendar.EventType | CallsCalendar.BadRequestResponse | CallsCalendar.NotFoundResponse;

  @doc("Lists upcoming bookings for all event types in one startAt-ordered list.")
  @get
  @route("/owner/bookings/upcoming")
  op listUpcomingBookings(): CallsCalendar.Booking[];
}
