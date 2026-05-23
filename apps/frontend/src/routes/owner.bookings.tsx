import { Alert, Badge, Box, Container, Divider, Group, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Booking } from "@calls-calendar/api-dto/generated";

import { calendarClient } from "../api/calendarClient";
import { calendarQueryKeys } from "../api/queryKeys";

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  weekday: "short",
});

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));
const formatTime = (value: string) => timeFormatter.format(new Date(value));

export const Route = createFileRoute("/owner/bookings")({
  component: OwnerBookingsPage,
});

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <Paper className="bookingRow" withBorder>
      <Box>
        <Group gap="xs">
          <Text fw={700}>{booking.guestName}</Text>
          <Badge color="gray" variant="light">
            {booking.eventTypeTitle}
          </Badge>
        </Group>
        <Text c="dimmed" size="sm">
          {formatDate(booking.startAt)} at {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
        </Text>
      </Box>
      <Badge color="teal" variant="light">
        #{booking.eventTypeId}
      </Badge>
    </Paper>
  );
}

function OwnerBookingsPage() {
  const ownerQuery = useQuery({ queryFn: calendarClient.getOwner, queryKey: calendarQueryKeys.owner });
  const bookingsQuery = useQuery({
    queryFn: calendarClient.listUpcomingBookings,
    queryKey: calendarQueryKeys.ownerBookings,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Paper className="topBar" withBorder>
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

        <Paper className="panel" withBorder>
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
            <Paper className="emptyState" withBorder>
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
