import { createFileRoute } from "@tanstack/react-router";

import { GuestBookingPage } from "../components/guest-booking/guest-booking-page";

export const Route = createFileRoute("/event-types/$eventTypeId")({
  component: BookingRoute,
});

function BookingRoute() {
  const { eventTypeId } = Route.useParams();
  const numericEventTypeId = Number(eventTypeId);
  const isValidEventTypeId = Number.isInteger(numericEventTypeId) && numericEventTypeId > 0;

  return <GuestBookingPage eventTypeId={numericEventTypeId} isValidEventTypeId={isValidEventTypeId} />;
}
