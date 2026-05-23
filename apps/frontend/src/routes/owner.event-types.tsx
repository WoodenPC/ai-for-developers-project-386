import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/owner/event-types")({
  component: Outlet,
});
