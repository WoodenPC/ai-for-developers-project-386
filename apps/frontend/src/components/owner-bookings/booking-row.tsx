import { Badge, Box, Group, Paper, Text } from "@mantine/core";
import type { Booking } from "@calls-calendar/api-dto/generated";

import { formatBookingDate, formatBookingTime } from "./date-formatters";
import styles from "./booking-row.module.css";

export function BookingRow({ booking }: { booking: Booking }) {
  return (
    <Paper
      className={styles.bookingRow}
      data-booking-id={booking.id}
      data-testid="owner-booking-row"
      withBorder
    >
      <Box className={styles.bookingRowContent}>
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
      <Badge className={styles.bookingRowMeta} color="gray" variant="light">
        Event #{booking.eventTypeId}
      </Badge>
    </Paper>
  );
}
