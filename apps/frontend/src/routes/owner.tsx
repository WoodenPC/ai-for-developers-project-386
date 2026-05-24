import { Box, Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

import sharedStyles from "../components/shared/layout.module.css";
import styles from "./owner.module.css";

export const Route = createFileRoute("/owner")({
  component: OwnerLayout,
});

function OwnerLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isOwnerIndex = pathname === "/owner" || pathname === "/owner/";

  return (
    <main className={sharedStyles.appShell}>
      <Box className={styles.ownerLayout}>
        <aside className={styles.ownerSidebar}>
          <Box className={styles.ownerSidebarHeader}>
            <Text c="dimmed" size="sm">
              Owner workspace
            </Text>
            <Title order={2}>Calendar</Title>
          </Box>

          <nav className={styles.ownerSidebarNav} aria-label="Owner navigation">
            <Link
              className={styles.ownerSidebarLink}
              data-active={pathname.startsWith("/owner/bookings")}
              data-testid="owner-bookings-nav-link"
              to="/owner/bookings"
            >
              Bookings
            </Link>
            <Link
              className={styles.ownerSidebarLink}
              data-active={pathname.startsWith("/owner/event-types")}
              data-testid="owner-event-types-nav-link"
              to="/owner/event-types"
            >
              Event types
            </Link>
          </nav>

          <Link className={styles.ownerSidebarSecondaryLink} data-testid="guest-view-link" to="/">
            Guest view
          </Link>
        </aside>

        <Box className={styles.ownerContent}>
          {isOwnerIndex ? <OwnerHome /> : <Outlet />}
        </Box>
      </Box>
    </main>
  );
}

function OwnerHome() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Paper className={sharedStyles.topBar} withBorder>
          <Box>
            <Text c="dimmed" size="sm">
              Owner workspace
            </Text>
            <Title order={1}>Workspace</Title>
            <Text c="dimmed">Choose a calendar area to manage.</Text>
          </Box>
        </Paper>

        <Box className={styles.ownerHomeGrid}>
          <Link className={styles.ownerHomeCard} data-testid="owner-bookings-card-link" to="/owner/bookings">
            <Group justify="space-between" wrap="nowrap">
              <Box>
                <Text fw={700}>Bookings</Text>
                <Text c="dimmed" size="sm">
                  Review upcoming guest calls.
                </Text>
              </Box>
              <Text c="teal" fw={700}>
                Open
              </Text>
            </Group>
          </Link>

          <Link className={styles.ownerHomeCard} data-testid="owner-event-types-card-link" to="/owner/event-types">
            <Group justify="space-between" wrap="nowrap">
              <Box>
                <Text fw={700}>Event types</Text>
                <Text c="dimmed" size="sm">
                  Manage public booking options.
                </Text>
              </Box>
              <Text c="teal" fw={700}>
                Open
              </Text>
            </Group>
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
