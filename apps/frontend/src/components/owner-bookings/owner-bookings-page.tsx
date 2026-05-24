import { Alert, Badge, Box, Container, Divider, Group, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { calendarClient } from "../../api/calendar-client";
import { calendarQueryKeys } from "../../api/query-keys";
import sharedStyles from "../shared/layout.module.css";
import { BookingRow } from "./booking-row";

export function OwnerBookingsPage() {
  const ownerQuery = useQuery({ queryFn: calendarClient.getOwner, queryKey: calendarQueryKeys.owner });
  const bookingsQuery = useQuery({
    queryFn: calendarClient.listUpcomingBookings,
    queryKey: calendarQueryKeys.ownerBookings,
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
              <Title order={1}>Bookings</Title>
              <Text c="dimmed">{ownerQuery.data?.email ?? ownerQuery.data?.name}</Text>
            </Box>
          </Group>
        </Paper>

        <Paper className={sharedStyles.panel} withBorder>
          <Group align="flex-start" justify="space-between">
            <Box>
              <Title order={2}>Upcoming bookings</Title>
              <Text c="dimmed" size="sm">
                Confirmed guest calls across all event types.
              </Text>
            </Box>
            <Badge color="teal" variant="light">
              {bookingsQuery.data?.length ?? 0} upcoming
            </Badge>
          </Group>
          <Divider my="md" />

          {bookingsQuery.isLoading ? (
            <Loader color="teal" size="sm" />
          ) : bookingsQuery.isError ? (
            <Alert color="red" radius="sm" variant="light">
              Failed to load bookings.
            </Alert>
          ) : bookingsQuery.data?.length === 0 ? (
            <Paper className={sharedStyles.emptyState} withBorder>
              <Text c="dimmed">No upcoming bookings.</Text>
            </Paper>
          ) : (
            <Stack gap="sm">
              {bookingsQuery.data?.map((booking) => (
                <BookingRow booking={booking} key={booking.id} />
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
