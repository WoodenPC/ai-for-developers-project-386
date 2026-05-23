import { createFileRoute } from "@tanstack/react-router";

import { OwnerBookingsPage } from "../components/owner-bookings/OwnerBookingsPage";

export const Route = createFileRoute("/owner/bookings")({
  component: OwnerBookingsPage,
});
