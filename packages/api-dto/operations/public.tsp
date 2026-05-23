using TypeSpec.Http;

namespace CallsCalendar;

@tag("Public")
namespace Public {
  model CreateBookingRequest {
    eventTypeId: CallsCalendar.EventTypeId;

    @doc("Start time of a free slot returned by GET /event-types/{eventTypeId}/slots.")
    startAt: utcDateTime;

    @doc("Guest name. Guest email is intentionally not part of the current contract.")
    guestName: CallsCalendar.NonEmptyString;
  }

  model CreatedBookingResponse {
    @statusCode statusCode: 201;
    @body booking: CallsCalendar.Booking;
  }

  @doc("Lists event types available to guests.")
  @get
  @route("/event-types")
  op listEventTypes(): CallsCalendar.EventType[];

  @doc("Returns a selected event type.")
  @get
  @route("/event-types/{eventTypeId}")
  op getEventType(
    @path eventTypeId: CallsCalendar.EventTypeId,
  ): CallsCalendar.EventType | CallsCalendar.NotFoundResponse;

  @doc("Lists free slots for the selected event type within the 14-day booking window starting from fromDate.")
  @get
  @route("/event-types/{eventTypeId}/slots")
  op listSlots(
    @path eventTypeId: CallsCalendar.EventTypeId,

    @doc("Calendar date sent by the client. Slots are returned for [fromDate, fromDate + 14 days).")
    @query fromDate: plainDate,
  ): CallsCalendar.Slot[] | CallsCalendar.BadRequestResponse | CallsCalendar.NotFoundResponse;

  @doc("Creates a guest booking for a free slot. The same start time cannot be booked twice, even for different event types.")
  @post
  @route("/bookings")
  op createBooking(
    @body body: CreateBookingRequest,
  ): CreatedBookingResponse | CallsCalendar.BadRequestResponse | CallsCalendar.NotFoundResponse | CallsCalendar.ConflictResponse;
}
