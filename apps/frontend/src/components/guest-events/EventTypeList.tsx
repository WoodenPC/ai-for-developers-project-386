import { Badge, Box, Group, Stack, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import type { EventType } from "@calls-calendar/api-dto/generated";

export function EventTypeList({ eventTypes }: { eventTypes: EventType[] }) {
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
