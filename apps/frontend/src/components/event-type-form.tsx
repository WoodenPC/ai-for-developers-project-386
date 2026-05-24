import { Button, Group, NumberInput, Stack, Textarea, TextInput } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export const eventTypeFormSchema = z.object({
  description: z.string().trim().min(1, "Description is required."),
  durationMinutes: z.number().int("Duration must be a whole number.").positive("Duration must be positive."),
  title: z.string().trim().min(1, "Title is required."),
});

export type EventTypeFormValues = z.infer<typeof eventTypeFormSchema>;

export const emptyEventTypeFormValues: EventTypeFormValues = {
  description: "",
  durationMinutes: 30,
  title: "",
};

export function EventTypeForm({
  defaultValues,
  isSubmitting,
  onCancel,
  onSubmit,
  submitLabel,
  submitTestId,
}: {
  defaultValues: EventTypeFormValues;
  isSubmitting: boolean;
  onCancel?: () => void;
  onSubmit: (values: EventTypeFormValues) => void;
  submitLabel: string;
  submitTestId?: string;
}) {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<EventTypeFormValues>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(eventTypeFormSchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          disabled={isSubmitting}
          error={errors.title?.message}
          label="Title"
          required
          {...register("title")}
        />
        <Textarea
          autosize
          disabled={isSubmitting}
          error={errors.description?.message}
          label="Description"
          minRows={3}
          required
          {...register("description")}
        />
        <Controller
          control={control}
          name="durationMinutes"
          render={({ field }) => (
            <NumberInput
              allowDecimal={false}
              allowNegative={false}
              disabled={isSubmitting}
              error={errors.durationMinutes?.message}
              label="Duration, minutes"
              min={1}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange(typeof value === "number" && Number.isFinite(value) ? value : 0)}
              required
              value={field.value}
            />
          )}
        />
        <Group justify="flex-end">
          {onCancel ? (
            <Button
              data-testid="cancel-event-button"
              disabled={isSubmitting}
              onClick={onCancel}
              radius="sm"
              type="button"
              variant="subtle"
            >
              Cancel
            </Button>
          ) : null}
          <Button
            data-testid={submitTestId}
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            radius="sm"
            type="submit"
          >
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
