import { Box, Text, Title } from "@mantine/core";
import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/owner")({
  component: OwnerLayout,
});

function OwnerLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <main className="appShell">
      <Box className="ownerLayout">
        <aside className="ownerSidebar">
          <Box className="ownerSidebarHeader">
            <Text c="dimmed" size="sm">
              Owner workspace
            </Text>
            <Title order={2}>Calendar</Title>
          </Box>

          <nav className="ownerSidebarNav" aria-label="Owner navigation">
            <Link
              className="ownerSidebarLink"
              data-active={pathname.startsWith("/owner/event-types")}
              to="/owner/event-types"
            >
              Event types
            </Link>
          </nav>

          <Link className="ownerSidebarSecondaryLink" to="/">
            Guest view
          </Link>
        </aside>

        <Box className="ownerContent">
          <Outlet />
        </Box>
      </Box>
    </main>
  );
}
