import { Badge, Box, Group, Paper, Text } from "@mantine/core";
import type { Booking } from "@calls-calendar/api-dto/generated";

import { formatBookingDate, formatBookingTime } from "./date-formatters";

export function BookingRow({ booking }: { booking: Booking }) {
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
          {formatBookingDate(booking.startAt)} at {formatBookingTime(booking.startAt)} -{" "}
          {formatBookingTime(booking.endAt)}
        </Text>
      </Box>
      <Badge color="teal" variant="light">
        #{booking.eventTypeId}
      </Badge>
    </Paper>
  );
}
