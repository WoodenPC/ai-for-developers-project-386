import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { EventTypeForm, emptyEventTypeFormValues } from "../components/EventTypeForm";
import { calendarClient } from "../api/calendarClient";
import { calendarQueryKeys } from "../api/queryKeys";

export const Route = createFileRoute("/owner/event-types/")({
  component: OwnerEventTypesPage,
});

function OwnerEventTypesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ownerQuery = useQuery({ queryFn: calendarClient.getOwner, queryKey: calendarQueryKeys.owner });
  const eventTypesQuery = useQuery({
    queryFn: calendarClient.listOwnerEventTypes,
    queryKey: calendarQueryKeys.ownerEventTypes,
  });
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const createEventTypeMutation = useMutation({
    mutationFn: calendarClient.createOwnerEventType,
    onSuccess: async () => {
      setCreateModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: calendarQueryKeys.ownerEventTypes });
    },
  });

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Paper className="topBar" withBorder>
          <Group justify="space-between" gap="md">
            <Box>
              <Text c="dimmed" size="sm">
                Owner workspace
              </Text>
              <Title order={1}>Event types</Title>
              <Text c="dimmed">{ownerQuery.data?.email ?? ownerQuery.data?.name}</Text>
            </Box>
            <Button onClick={openCreateModal} radius="sm">
              New event
            </Button>
          </Group>
        </Paper>

        <Paper className="panel" withBorder>
          <Group align="flex-start" justify="space-between">
            <Box>
              <Title order={2}>Managed events</Title>
              <Text c="dimmed" size="sm">
                Booking options available to guests.
              </Text>
            </Box>
            <Badge color="teal" variant="light">
              {eventTypesQuery.data?.length ?? 0} active
            </Badge>
          </Group>
          <Divider my="md" />

          {eventTypesQuery.isLoading ? (
            <Loader color="teal" size="sm" />
          ) : eventTypesQuery.isError ? (
            <Alert color="red" radius="sm" variant="light">
              Failed to load event types.
            </Alert>
          ) : eventTypesQuery.data?.length === 0 ? (
            <Paper className="emptyState" withBorder>
              <Text c="dimmed">No event types yet.</Text>
            </Paper>
          ) : (
            <Stack gap="sm">
              {eventTypesQuery.data?.map((eventType) => (
                <Paper className="eventTypeRow" key={eventType.id} withBorder>
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
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>

      <Modal
        centered
        onClose={() => setCreateModalOpen(false)}
        opened={isCreateModalOpen}
        radius="sm"
        title="New event"
      >
        {createEventTypeMutation.isError ? (
          <Alert color="red" mb="md" radius="sm" variant="light">
            Failed to create event type.
          </Alert>
        ) : null}
        <EventTypeForm
          defaultValues={emptyEventTypeFormValues}
          isSubmitting={createEventTypeMutation.isPending}
          onCancel={() => setCreateModalOpen(false)}
          onSubmit={(values) => createEventTypeMutation.mutate(values)}
          submitLabel="Create event"
        />
      </Modal>
    </Container>
  );
}
