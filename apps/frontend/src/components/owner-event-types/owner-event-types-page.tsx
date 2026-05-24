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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { calendarClient } from "../../api/calendar-client";
import { calendarQueryKeys } from "../../api/query-keys";
import { EventTypeForm, emptyEventTypeFormValues } from "../event-type-form";
import sharedStyles from "../shared/layout.module.css";
import { EventTypeRow } from "./event-type-row";

export function OwnerEventTypesPage() {
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

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Paper className={sharedStyles.topBar} withBorder>
          <Group justify="space-between" gap="md">
            <Box>
              <Text c="dimmed" size="sm">
                Owner workspace
              </Text>
              <Title order={1}>Event types</Title>
              <Text c="dimmed">{ownerQuery.data?.email ?? ownerQuery.data?.name}</Text>
            </Box>
            <Button data-testid="new-event-button" onClick={() => setCreateModalOpen(true)} radius="sm">
              New event
            </Button>
          </Group>
        </Paper>

        <Paper className={sharedStyles.panel} withBorder>
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
            <Paper className={sharedStyles.emptyState} withBorder>
              <Text c="dimmed">No event types yet.</Text>
            </Paper>
          ) : (
            <Stack gap="sm">
              {eventTypesQuery.data?.map((eventType) => (
                <EventTypeRow eventType={eventType} key={eventType.id} />
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
          submitTestId="create-event-button"
          submitLabel="Create event"
        />
      </Modal>
    </Container>
  );
}
