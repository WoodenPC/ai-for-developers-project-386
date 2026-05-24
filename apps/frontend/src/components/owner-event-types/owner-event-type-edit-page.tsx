import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

import { calendarClient } from "../../api/calendar-client";
import { calendarQueryKeys } from "../../api/query-keys";
import { EventTypeForm, emptyEventTypeFormValues, type EventTypeFormValues } from "../event-type-form";
import sharedStyles from "../shared/layout.module.css";

export function OwnerEventTypeEditPage({
  eventTypeId,
  isValidEventTypeId,
}: {
  eventTypeId: number;
  isValidEventTypeId: boolean;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const eventTypeQuery = useQuery({
    enabled: isValidEventTypeId,
    queryFn: () => calendarClient.getOwnerEventType(eventTypeId),
    queryKey: calendarQueryKeys.ownerEventType(eventTypeId),
  });

  const updateEventTypeMutation = useMutation({
    mutationFn: (values: EventTypeFormValues) => calendarClient.updateOwnerEventType(eventTypeId, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: calendarQueryKeys.ownerEventTypes });
      await navigate({ to: "/owner/event-types" });
    },
  });

  const eventTypeFormDefaults = useMemo<EventTypeFormValues>(
    () =>
      eventTypeQuery.data
        ? {
            description: eventTypeQuery.data.description,
            durationMinutes: eventTypeQuery.data.durationMinutes,
            title: eventTypeQuery.data.title,
          }
        : emptyEventTypeFormValues,
    [eventTypeQuery.data],
  );

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Paper className={sharedStyles.topBar} withBorder>
          <Stack gap="md">
            <Group gap="sm">
              <ActionIcon
                aria-label="Back to event types"
                component={Link}
                data-testid="back-to-event-types-button"
                radius="sm"
                size="lg"
                to="/owner/event-types"
                variant="subtle"
              >
                &larr;
              </ActionIcon>
              <Breadcrumbs separator="/">
                <Anchor component={Link} data-testid="event-types-breadcrumb-link" size="sm" to="/owner/event-types">
                  Event types
                </Anchor>
                <Text c="dimmed" size="sm">
                  Edit
                </Text>
              </Breadcrumbs>
            </Group>
            <Box>
              <Text c="dimmed" size="sm">
                Owner workspace
              </Text>
              <Title order={1}>Edit event</Title>
              {isValidEventTypeId ? (
                <Badge color="gray" mt="xs" variant="light">
                  #{eventTypeId}
                </Badge>
              ) : null}
            </Box>
          </Stack>
        </Paper>

        <Paper className={sharedStyles.panel} withBorder>
          {!isValidEventTypeId ? (
            <Alert color="red" data-testid="event-id-error" radius="sm" variant="light">
              Event id must be a positive number.
            </Alert>
          ) : eventTypeQuery.isLoading ? (
            <Loader color="teal" size="sm" />
          ) : eventTypeQuery.isError ? (
            <Alert color="red" radius="sm" variant="light">
              Event type was not found.
            </Alert>
          ) : (
            <>
              <Group align="flex-start" justify="space-between">
                <Box>
                  <Title order={2}>{eventTypeQuery.data?.title}</Title>
                  <Text c="dimmed" size="sm">
                    Update the public booking details for this event.
                  </Text>
                </Box>
                <Badge color="teal" variant="light">
                  {eventTypeQuery.data?.durationMinutes} min
                </Badge>
              </Group>
              <Divider my="md" />
              {updateEventTypeMutation.isError ? (
                <Alert color="red" mb="md" radius="sm" variant="light">
                  Failed to update event type.
                </Alert>
              ) : null}
              <EventTypeForm
                defaultValues={eventTypeFormDefaults}
                isSubmitting={updateEventTypeMutation.isPending}
                onSubmit={(values) => updateEventTypeMutation.mutate(values)}
                submitTestId="save-event-button"
                submitLabel="Save changes"
              />
            </>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
