import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import type { EventType, Slot } from "@calls-calendar/api-dto/generated";
import { useMemo, useState } from "react";

import { calendarClient } from "./api/calendarClient";

const dateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));
const formatTime = (value: string) => timeFormatter.format(new Date(value));

function EventTypeList({
  eventTypes,
  selectedId,
  onSelect,
}: {
  eventTypes: EventType[];
  selectedId: number;
  onSelect: (eventTypeId: number) => void;
}) {
  return (
    <Stack gap="sm">
      {eventTypes.map((eventType) => (
        <button
          className="eventTypeButton"
          data-active={eventType.id === selectedId}
          key={eventType.id}
          onClick={() => onSelect(eventType.id)}
          type="button"
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
        </button>
      ))}
    </Stack>
  );
}

function SlotList({ slots }: { slots: Slot[] }) {
  if (slots.length === 0) {
    return (
      <Paper className="emptyState" withBorder>
        <Text c="dimmed">No slots found for this event type.</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="sm">
      {slots.map((slot) => (
        <Paper className="slotRow" key={`${slot.eventTypeId}-${slot.startAt}`} withBorder>
          <Box>
            <Text fw={700}>{formatDate(slot.startAt)}</Text>
            <Text c="dimmed" size="sm">
              {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
            </Text>
          </Box>
          <Button disabled={!slot.available} radius="sm" variant={slot.available ? "filled" : "light"}>
            {slot.available ? "Book" : "Taken"}
          </Button>
        </Paper>
      ))}
    </Stack>
  );
}

export function App() {
  const ownerQuery = useQuery({ queryFn: calendarClient.getOwner, queryKey: ["owner"] });
  const eventTypesQuery = useQuery({ queryFn: calendarClient.listEventTypes, queryKey: ["eventTypes"] });

  const eventTypes = eventTypesQuery.data ?? [];
  const [selectedEventTypeId, setSelectedEventTypeId] = useState(eventTypes[0]?.id ?? 1);
  const selectedEventType = useMemo(
    () => eventTypes.find((eventType) => eventType.id === selectedEventTypeId) ?? eventTypes[0],
    [eventTypes, selectedEventTypeId],
  );

  const slotsQuery = useQuery({
    enabled: Boolean(selectedEventType?.id),
    queryFn: () => calendarClient.listSlots(selectedEventType?.id ?? 0),
    queryKey: ["slots", selectedEventType?.id],
  });

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

          <Box className="guestGrid">
            <Box>
              <Paper className="panel" withBorder>
                <Stack gap="md">
                  <Box>
                    <Title order={2}>Choose call type</Title>
                    <Text c="dimmed" size="sm">
                      Public event types available for booking.
                    </Text>
                  </Box>
                  <EventTypeList
                    eventTypes={eventTypes}
                    onSelect={setSelectedEventTypeId}
                    selectedId={selectedEventType?.id ?? 0}
                  />
                </Stack>
              </Paper>
            </Box>

            <Box>
              <Paper className="panel" withBorder>
                <Group align="flex-start" justify="space-between">
                  <Box>
                    <Title order={2}>{selectedEventType?.title ?? "Available slots"}</Title>
                    <Text c="dimmed" size="sm">
                      Next 14-day booking window.
                    </Text>
                  </Box>
                  <Badge color="blue" variant="light">
                    {slotsQuery.data?.filter((slot) => slot.available).length ?? 0} free
                  </Badge>
                </Group>
                <Divider my="md" />
                {slotsQuery.isLoading ? <Loader color="teal" size="sm" /> : <SlotList slots={slotsQuery.data ?? []} />}
              </Paper>
            </Box>
          </Box>
        </Stack>
      </Container>
    </main>
  );
}
