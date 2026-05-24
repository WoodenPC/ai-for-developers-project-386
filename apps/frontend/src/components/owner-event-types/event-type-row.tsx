import { Badge, Box, Button, Group, Paper, Text } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import type { EventType } from "@calls-calendar/api-dto/generated";

import styles from "./event-type-row.module.css";

export function EventTypeRow({ eventType }: { eventType: EventType }) {
  const navigate = useNavigate();

  return (
    <Paper
      className={styles.eventTypeRow}
      data-event-type-id={eventType.id}
      data-testid="owner-event-type-row"
      withBorder
    >
      <Box className={styles.eventTypeRowContent}>
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
      <Group className={styles.eventTypeRowActions} gap="sm">
        <Badge color="teal" variant="light">
          {eventType.durationMinutes} min
        </Badge>
        <Button
          data-testid="edit-event-button"
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
