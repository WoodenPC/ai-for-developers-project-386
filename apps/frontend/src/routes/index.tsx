import { createFileRoute } from "@tanstack/react-router";

import { GuestEventsPage } from "../components/guest-events/GuestEventsPage";

export const Route = createFileRoute("/")({
  component: GuestEventsPage,
});
