import { createFileRoute } from "@tanstack/react-router";

import { OwnerEventTypesPage } from "../components/owner-event-types/OwnerEventTypesPage";

export const Route = createFileRoute("/owner/event-types/")({
  component: OwnerEventTypesPage,
});
