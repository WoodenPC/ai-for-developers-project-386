import { Alert, Badge, Box, Button, Container, Divider, Group, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { EventTypeForm, emptyEventTypeFormValues, type EventTypeFormValues } from "../components/EventTypeForm";
import { calendarClient } from "../api/calendarClient";

export const Route = createFileRoute("/owner/event-types/$eventTypeId/edit")({
  component: OwnerEventTypeEditPage,
});

function OwnerEventTypeEditPage() {
  const { eventTypeId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const numericEventTypeId = useMemo(() => Number(eventTypeId), [eventTypeId]);
  const isValidEventTypeId = Number.isInteger(numericEventTypeId) && numericEventTypeId > 0;

  const eventTypeQuery = useQuery({
    enabled: isValidEventTypeId,
    queryFn: () => calendarClient.getOwnerEventType(numericEventTypeId),
    queryKey: ["owner", "eventTypes", numericEventTypeId],
  });

  const updateEventTypeMutation = useMutation({
    mutationFn: (values: EventTypeFormValues) => calendarClient.updateOwnerEventType(numericEventTypeId, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["owner", "eventTypes"] });
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
    <main className="appShell">
      <Container size="md" py="xl">
        <Stack gap="lg">
          <Paper className="topBar" withBorder>
            <Group justify="space-between" gap="md">
              <Box>
                <Text c="dimmed" size="sm">
                  Owner workspace
                </Text>
                <Title order={1}>Edit event</Title>
                {isValidEventTypeId ? (
                  <Badge color="gray" mt="xs" variant="light">
                    #{numericEventTypeId}
                  </Badge>
                ) : null}
              </Box>
              <Button component={Link} radius="sm" to="/owner/event-types" variant="subtle">
                Back to events
              </Button>
            </Group>
          </Paper>

          <Paper className="panel" withBorder>
            {!isValidEventTypeId ? (
              <Alert color="red" radius="sm" variant="light">
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
                  submitLabel="Save changes"
                />
              </>
            )}
          </Paper>
        </Stack>
      </Container>
    </main>
  );
}
