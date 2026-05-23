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
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import type { Booking, Slot } from "@calls-calendar/api-dto/generated";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CalendarApiError, calendarClient } from "../api/calendarClient";
import { calendarQueryKeys } from "../api/queryKeys";

export const Route = createFileRoute("/event-types/$eventTypeId")({
  component: BookingPage,
});

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  weekday: "long",
});

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

const bookingFormSchema = z.object({
  guestName: z.string().trim().min(1, "Name is required."),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function todayDateString() {
  return toDateString(new Date());
}

function normalizeDateValue(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value.slice(0, 10) : toDateString(value);
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}

function isPastSlot(slot: Slot) {
  return new Date(slot.startAt).getTime() <= Date.now();
}

function SlotSkeletonList() {
  return (
    <Stack gap="xs">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton height={52} key={index} radius="sm" />
      ))}
    </Stack>
  );
}

function BookingPage() {
  const { eventTypeId } = Route.useParams();
  const queryClient = useQueryClient();
  const numericEventTypeId = useMemo(() => Number(eventTypeId), [eventTypeId]);
  const isValidEventTypeId = Number.isInteger(numericEventTypeId) && numericEventTypeId > 0;
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
    queryFn: () => calendarClient.getEventType(numericEventTypeId),
    queryKey: calendarQueryKeys.eventType(numericEventTypeId),
  });
  const slotsQuery = useQuery({
    enabled: isValidEventTypeId,
    queryFn: () => calendarClient.listSlots(numericEventTypeId, selectedDate),
    queryKey: calendarQueryKeys.slots(numericEventTypeId, selectedDate),
  });

  useEffect(() => {
    setSelectedSlotStartAt(null);
    setCreatedBooking(null);
  }, [numericEventTypeId, selectedDate]);

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
        eventTypeId: numericEventTypeId,
        guestName: values.guestName.trim(),
        startAt: selectedSlot.startAt,
      });
    },
    onSuccess: async (booking) => {
      setCreatedBooking(booking);
      setSelectedSlotStartAt(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: calendarQueryKeys.slots(numericEventTypeId, selectedDate) }),
        queryClient.invalidateQueries({ queryKey: calendarQueryKeys.ownerBookings }),
      ]);
    },
  });

  const canSubmit = selectedSlot
    ? isValid && !createBookingMutation.isPending && !isPastSlot(selectedSlot)
    : false;
  const errorMessage =
    createBookingMutation.error instanceof CalendarApiError
      ? createBookingMutation.error.message
      : "Failed to create booking.";

  return (
    <main className="appShell">
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Paper className="topBar" withBorder>
            <Group justify="space-between" gap="md">
              <Box>
                <Text c="dimmed" size="sm">
                  Guest booking
                </Text>
                <Title order={1}>Book a call</Title>
                <Text c="dimmed">{ownerQuery.data?.email ?? ownerQuery.data?.name}</Text>
              </Box>
              <Button component={Link} radius="sm" to="/" variant="light">
                All events
              </Button>
            </Group>
          </Paper>

          {!isValidEventTypeId ? (
            <Alert color="red" radius="sm" variant="light">
              Event id must be a positive number.
            </Alert>
          ) : eventTypeQuery.isLoading || ownerQuery.isLoading ? (
            <Paper className="panel" withBorder>
              <Loader color="teal" size="sm" />
            </Paper>
          ) : eventTypeQuery.isError ? (
            <Alert color="red" radius="sm" variant="light">
              Event type was not found.
            </Alert>
          ) : (
            <Box
              className="bookingGrid"
              component="form"
              onSubmit={handleSubmit((values) => createBookingMutation.mutate(values))}
            >
              <Paper className="panel bookingSidePanel" withBorder>
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
                  <Box>
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
                    disabled={createBookingMutation.isPending}
                    error={errors.guestName?.message}
                    label="Your name"
                    placeholder="Taylor Kim"
                    required
                    {...register("guestName")}
                  />
                </Stack>
              </Paper>

              <Paper className="panel bookingCalendarPanel" withBorder>
                <Stack gap="md">
                  <Box>
                    <Title order={2}>Select date</Title>
                    <Text c="dimmed" size="sm">
                      {formatDate(selectedDate)}
                    </Text>
                  </Box>
                  <DatePicker
                    fullWidth
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

              <Paper className="panel bookingTimePanel" withBorder>
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
                    <Paper className="emptyState" withBorder>
                      <Text c="dimmed">No times available for this date.</Text>
                    </Paper>
                  ) : (
                    <Stack gap="xs">
                      {visibleSlots.map((slot) => {
                        const disabled = !slot.available || isPastSlot(slot) || createBookingMutation.isPending;
                        const selected = selectedSlotStartAt === slot.startAt;

                        return (
                          <Button
                            className="timeSlotButton"
                            disabled={disabled}
                            fullWidth
                            key={`${slot.eventTypeId}-${slot.startAt}`}
                            onClick={() => setSelectedSlotStartAt(slot.startAt)}
                            radius="sm"
                            variant={selected ? "filled" : "light"}
                          >
                            <Box>
                              <Text fw={700} size="sm">
                                {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
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
                    <Alert color="teal" radius="sm" variant="light">
                      Confirmed for {formatDate(toDateString(new Date(createdBooking.startAt)))} at{" "}
                      {formatTime(createdBooking.startAt)}.
                    </Alert>
                  ) : null}

                  <Button
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
