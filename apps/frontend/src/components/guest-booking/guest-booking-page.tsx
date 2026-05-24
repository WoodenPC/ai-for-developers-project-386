import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { Booking } from "@calls-calendar/api-dto/generated";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CalendarApiError, calendarClient } from "../../api/calendar-client";
import { calendarQueryKeys } from "../../api/query-keys";
import sharedStyles from "../shared/layout.module.css";
import { SlotSkeletonList } from "./slot-skeleton-list";
import { formatDate, formatTime, normalizeDateValue, toDateString, todayDateString } from "./date-utils";
import { isPastSlot } from "./slot-utils";
import styles from "./guest-booking-page.module.css";

const bookingFormSchema = z.object({
  guestName: z.string().trim().min(1, "Name is required."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function GuestBookingPage({
  eventTypeId,
  isValidEventTypeId,
}: {
  eventTypeId: number;
  isValidEventTypeId: boolean;
}) {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  const [selectedSlotStartAt, setSelectedSlotStartAt] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<BookingFormValues>({
    defaultValues: { guestName: "" },
    mode: "onChange",
    resolver: zodResolver(bookingFormSchema),
  });

  const ownerQuery = useQuery({ queryFn: calendarClient.getOwner, queryKey: calendarQueryKeys.owner });
  const eventTypeQuery = useQuery({
    enabled: isValidEventTypeId,
    queryFn: () => calendarClient.getEventType(eventTypeId),
    queryKey: calendarQueryKeys.eventType(eventTypeId),
  });
  const slotsQuery = useQuery({
    enabled: isValidEventTypeId,
    queryFn: () => calendarClient.listSlots(eventTypeId, selectedDate),
    queryKey: calendarQueryKeys.slots(eventTypeId, selectedDate),
  });

  useEffect(() => {
    setSelectedSlotStartAt(null);
    setCreatedBooking(null);
  }, [eventTypeId, selectedDate]);

  const visibleSlots = useMemo(
    () =>
      (slotsQuery.data ?? [])
        .filter((slot) => toDateString(new Date(slot.startAt)) === selectedDate)
        .sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime()),
    [selectedDate, slotsQuery.data],
  );

  const selectedSlot = useMemo(
    () => visibleSlots.find((slot) => slot.startAt === selectedSlotStartAt),
    [selectedSlotStartAt, visibleSlots],
  );

  const createBookingMutation = useMutation({
    mutationFn: (values: BookingFormValues) => {
      if (!selectedSlot) {
        throw new Error("Select a time first.");
      }

      return calendarClient.createBooking({
        eventTypeId,
        guestName: values.guestName.trim(),
        startAt: selectedSlot.startAt,
      });
    },
    onSuccess: async (booking) => {
      setCreatedBooking(booking);
      setSelectedSlotStartAt(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: calendarQueryKeys.slots(eventTypeId, selectedDate) }),
        queryClient.invalidateQueries({ queryKey: calendarQueryKeys.ownerBookings }),
      ]);
    },
  });

  const canSubmit = selectedSlot ? isValid && !createBookingMutation.isPending && !isPastSlot(selectedSlot) : false;
  const errorMessage =
    createBookingMutation.error instanceof CalendarApiError
      ? createBookingMutation.error.message
      : "Failed to create booking.";

  return (
    <main className={sharedStyles.appShell}>
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Paper className={sharedStyles.topBar} withBorder>
            <Group justify="space-between" gap="md">
              <Box>
                <Text c="dimmed" size="sm">
                  Guest booking
                </Text>
                <Title order={1}>Book a call</Title>
                <Text c="dimmed">{ownerQuery.data?.email ?? ownerQuery.data?.name}</Text>
              </Box>
              <Button component={Link} data-testid="all-events-link" radius="sm" to="/" variant="light">
                All events
              </Button>
            </Group>
          </Paper>

          {!isValidEventTypeId ? (
            <Alert color="red" data-testid="event-id-error" radius="sm" variant="light">
              Event id must be a positive number.
            </Alert>
          ) : eventTypeQuery.isLoading || ownerQuery.isLoading ? (
            <Paper className={sharedStyles.panel} withBorder>
              <Loader color="teal" size="sm" />
            </Paper>
          ) : eventTypeQuery.isError ? (
            <Alert color="red" radius="sm" variant="light">
              Event type was not found.
            </Alert>
          ) : (
            <Box
              className={styles.bookingGrid}
              component="form"
              onSubmit={handleSubmit((values) => createBookingMutation.mutate(values))}
            >
              <Paper className={`${sharedStyles.panel} ${styles.bookingSidePanel}`} withBorder>
                <Stack gap="md">
                  <Box>
                    <Text c="dimmed" size="sm">
                      Book with
                    </Text>
                    <Title order={2}>{ownerQuery.data?.name}</Title>
                    <Text c="dimmed" size="sm">
                      {ownerQuery.data?.email}
                    </Text>
                  </Box>
                  <Divider />
                  <Box data-testid="booking-event-type-summary">
                    <Group gap="xs">
                      <Text fw={700}>{eventTypeQuery.data?.title}</Text>
                      <Badge color="teal" variant="light">
                        {eventTypeQuery.data?.durationMinutes} min
                      </Badge>
                    </Group>
                    <Text c="dimmed" mt="xs" size="sm">
                      {eventTypeQuery.data?.description}
                    </Text>
                  </Box>
                  <TextInput
                    data-testid="guest-name-input"
                    disabled={createBookingMutation.isPending}
                    error={errors.guestName?.message}
                    label="Your name"
                    placeholder="Taylor Kim"
                    required
                    {...register("guestName")}
                  />
                </Stack>
              </Paper>

              <Paper className={`${sharedStyles.panel} ${styles.bookingCalendarPanel}`} withBorder>
                <Stack gap="md">
                  <Box>
                    <Title order={2}>Select date</Title>
                    <Text c="dimmed" size="sm">
                      {formatDate(selectedDate)}
                    </Text>
                  </Box>
                  <DatePicker
                    fullWidth
                    getDayProps={(date) => ({
                      "data-date": date,
                      "data-testid": "booking-calendar-day",
                    })}
                    minDate={todayDateString()}
                    onChange={(value) => {
                      const nextDate = normalizeDateValue(value);

                      if (nextDate) {
                        setSelectedDate(nextDate);
                      }
                    }}
                    value={selectedDate}
                  />
                </Stack>
              </Paper>

              <Paper className={`${sharedStyles.panel} ${styles.bookingTimePanel}`} withBorder>
                <Stack gap="md">
                  <Box>
                    <Title order={2}>Select time</Title>
                    <Text c="dimmed" size="sm">
                      {formatDate(selectedDate)}
                    </Text>
                  </Box>

                  {slotsQuery.isLoading ? (
                    <SlotSkeletonList />
                  ) : slotsQuery.isError ? (
                    <Alert color="red" radius="sm" variant="light">
                      Failed to load times.
                    </Alert>
                  ) : visibleSlots.length === 0 ? (
                    <Paper className={sharedStyles.emptyState} withBorder>
                      <Text c="dimmed">No times available for this date.</Text>
                    </Paper>
                  ) : (
                    <Stack gap="xs">
                      {visibleSlots.map((slot) => {
                        const pastSlot = isPastSlot(slot);
                        const disabled = !slot.available || pastSlot || createBookingMutation.isPending;
                        const selected = selectedSlotStartAt === slot.startAt;
                        const slotState = createBookingMutation.isPending
                          ? "pending"
                          : !slot.available
                            ? "taken"
                            : pastSlot
                              ? "past"
                              : "available";
                        const slotTimeLabel = `${formatTime(slot.startAt)} - ${formatTime(slot.endAt)}`;

                        return (
                          <Button
                            aria-label={`Select time slot ${slotTimeLabel}`}
                            className={styles.timeSlotButton}
                            data-slot-start-at={slot.startAt}
                            data-slot-state={slotState}
                            data-testid="booking-slot-option"
                            disabled={disabled}
                            fullWidth
                            key={`${slot.eventTypeId}-${slot.startAt}`}
                            onClick={() => setSelectedSlotStartAt(slot.startAt)}
                            radius="sm"
                            variant={selected ? "filled" : "light"}
                          >
                            <Box>
                              <Text fw={700} size="sm">
                                {slotTimeLabel}
                              </Text>
                              {disabled ? (
                                <Text c="dimmed" size="xs">
                                  {slot.available ? "Past" : "Taken"}
                                </Text>
                              ) : null}
                            </Box>
                          </Button>
                        );
                      })}
                    </Stack>
                  )}

                  {createBookingMutation.isError ? (
                    <Alert color="red" radius="sm" variant="light">
                      {errorMessage}
                    </Alert>
                  ) : null}

                  {createdBooking ? (
                    <Alert color="teal" data-testid="booking-confirmation" radius="sm" variant="light">
                      Confirmed for {formatDate(toDateString(new Date(createdBooking.startAt)))} at{" "}
                      {formatTime(createdBooking.startAt)}.
                    </Alert>
                  ) : null}

                  <Button
                    data-testid="confirm-booking-button"
                    disabled={!canSubmit}
                    loading={createBookingMutation.isPending}
                    radius="sm"
                    type="submit"
                  >
                    Confirm booking
                  </Button>
                </Stack>
              </Paper>
            </Box>
          )}
        </Stack>
      </Container>
    </main>
  );
}
