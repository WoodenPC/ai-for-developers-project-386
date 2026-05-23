import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { EventType } from "@calls-calendar/api-dto/generated";

import { calendarClient } from "./api/calendarClient";
import { calendarQueryKeys } from "./api/queryKeys";

function EventTypeList({ eventTypes }: { eventTypes: EventType[] }) {
  return (
    <Stack gap="sm">
      {eventTypes.map((eventType) => (
        <Link
          className="eventTypeButton"
          key={eventType.id}
          params={{ eventTypeId: String(eventType.id) }}
          to="/event-types/$eventTypeId"
        >
          <Group justify="space-between" wrap="nowrap">
            <Box>
              <Text fw={700}>{eventType.title}</Text>
              <Text c="dimmed" size="sm">
                {eventType.description}
              </Text>
            </Box>
            <Badge color="teal" variant="light">
              {eventType.durationMinutes} min
            </Badge>
          </Group>
        </Link>
      ))}
    </Stack>
  );
}

export function App() {
  const ownerQuery = useQuery({ queryFn: calendarClient.getOwner, queryKey: calendarQueryKeys.owner });
  const eventTypesQuery = useQuery({
    queryFn: calendarClient.listEventTypes,
    queryKey: calendarQueryKeys.eventTypes,
  });

  const eventTypes = eventTypesQuery.data ?? [];

  if (ownerQuery.isLoading || eventTypesQuery.isLoading) {
    return (
      <main className="loadingScreen">
        <Loader color="teal" />
      </main>
    );
  }

  return (
    <main className="appShell">
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Paper className="topBar" withBorder>
            <Group justify="space-between" gap="md">
              <Box>
                <Text c="dimmed" size="sm">
                  Guest booking
                </Text>
                <Title order={1}>{ownerQuery.data?.name}</Title>
                <Text c="dimmed">{ownerQuery.data?.email}</Text>
              </Box>
              <Button
                component="a"
                href="/owner/event-types"
                radius="sm"
                variant="light"
              >
                Owner events
              </Button>
            </Group>
          </Paper>

          <Paper className="panel" withBorder>
            <Stack gap="md">
              <Box>
                <Title order={2}>Choose call type</Title>
                <Text c="dimmed" size="sm">
                  Public event types available for booking.
                </Text>
              </Box>
              {eventTypesQuery.isError ? (
                <Paper className="emptyState" withBorder>
                  <Text c="dimmed">Failed to load event types.</Text>
                </Paper>
              ) : eventTypes.length === 0 ? (
                <Paper className="emptyState" withBorder>
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
