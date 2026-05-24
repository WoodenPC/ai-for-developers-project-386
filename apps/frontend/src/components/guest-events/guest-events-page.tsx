import { Box, Button, Container, Group, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { calendarClient } from "../../api/calendar-client";
import { calendarQueryKeys } from "../../api/query-keys";
import sharedStyles from "../shared/layout.module.css";
import { EventTypeList } from "./event-type-list";

export function GuestEventsPage() {
  const ownerQuery = useQuery({ queryFn: calendarClient.getOwner, queryKey: calendarQueryKeys.owner });
  const eventTypesQuery = useQuery({
    queryFn: calendarClient.listEventTypes,
    queryKey: calendarQueryKeys.eventTypes,
  });

  const eventTypes = eventTypesQuery.data ?? [];

  if (ownerQuery.isLoading || eventTypesQuery.isLoading) {
    return (
      <main className={sharedStyles.loadingScreen}>
        <Loader color="teal" />
      </main>
    );
  }

  return (
    <main className={sharedStyles.appShell}>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Paper className={sharedStyles.topBar} withBorder>
            <Group justify="space-between" gap="md">
              <Box>
                <Text c="dimmed" size="sm">
                  Guest booking
                </Text>
                <Title order={1}>{ownerQuery.data?.name}</Title>
                <Text c="dimmed" data-testid="guest-owner-email">
                  {ownerQuery.data?.email}
                </Text>
              </Box>
              <Button
                component="a"
                data-testid="owner-events-link"
                href="/owner/event-types"
                radius="sm"
                variant="light"
              >
                Owner events
              </Button>
            </Group>
          </Paper>

          <Paper className={sharedStyles.panel} withBorder>
            <Stack gap="md">
              <Box>
                <Title order={2}>Choose call type</Title>
                <Text c="dimmed" size="sm">
                  Public event types available for booking.
                </Text>
              </Box>
              {eventTypesQuery.isError ? (
                <Paper className={sharedStyles.emptyState} withBorder>
                  <Text c="dimmed">Failed to load event types.</Text>
                </Paper>
              ) : eventTypes.length === 0 ? (
                <Paper className={sharedStyles.emptyState} withBorder>
                  <Text c="dimmed">No event types available.</Text>
                </Paper>
              ) : (
                <EventTypeList eventTypes={eventTypes} />
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </main>
  );
}
