import { createFileRoute } from "@tanstack/react-router";

import { OwnerEventTypesPage } from "../components/owner-event-types/owner-event-types-page";

export const Route = createFileRoute("/owner/event-types/")({
  component: OwnerEventTypesPage,
});
