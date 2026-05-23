import { Skeleton, Stack } from "@mantine/core";

export function SlotSkeletonList() {
  return (
    <Stack gap="xs">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton height={52} key={index} radius="sm" />
      ))}
    </Stack>
  );
}
