import { createFileRoute } from "@tanstack/react-router";

import { OwnerEventTypeEditPage } from "../components/owner-event-types/owner-event-type-edit-page";

export const Route = createFileRoute("/owner/event-types/$eventTypeId/edit")({
  component: OwnerEventTypeEditRoute,
});

function OwnerEventTypeEditRoute() {
  const { eventTypeId } = Route.useParams();
  const numericEventTypeId = Number(eventTypeId);
  const isValidEventTypeId = Number.isInteger(numericEventTypeId) && numericEventTypeId > 0;

  return <OwnerEventTypeEditPage eventTypeId={numericEventTypeId} isValidEventTypeId={isValidEventTypeId} />;
}
