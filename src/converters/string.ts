export function stringConverter(input: unknown): string | undefined {
  const type = typeof input;
  if (type === "string") {
    return input as string;
  }

  return input?.toString() || undefined;
}
