import { Badge, Box, Button, Group, Paper, Text } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import type { EventType } from "@calls-calendar/api-dto/generated";

export function EventTypeRow({ eventType }: { eventType: EventType }) {
  const navigate = useNavigate();

  return (
    <Paper className="eventTypeRow" withBorder>
      <Box>
        <Group gap="xs">
          <Text fw={700}>{eventType.title}</Text>
          <Badge color="gray" variant="light">
            #{eventType.id}
          </Badge>
        </Group>
        <Text c="dimmed" size="sm">
          {eventType.description}
        </Text>
      </Box>
      <Group gap="sm">
        <Badge color="teal" variant="light">
          {eventType.durationMinutes} min
        </Badge>
        <Button
          onClick={() =>
            navigate({
              params: { eventTypeId: String(eventType.id) },
              to: "/owner/event-types/$eventTypeId/edit",
            })
          }
          radius="sm"
          variant="light"
        >
          Edit
        </Button>
      </Group>
    </Paper>
  );
}
