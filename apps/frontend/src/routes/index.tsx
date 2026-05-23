import { createFileRoute } from "@tanstack/react-router";

import { GuestEventsPage } from "../components/guest-events/guest-events-page";

export const Route = createFileRoute("/")({
  component: GuestEventsPage,
});
