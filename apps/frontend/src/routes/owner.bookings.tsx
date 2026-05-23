import { createFileRoute } from "@tanstack/react-router";

import { OwnerBookingsPage } from "../components/owner-bookings/owner-bookings-page";

export const Route = createFileRoute("/owner/bookings")({
  component: OwnerBookingsPage,
});
