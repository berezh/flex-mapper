import { stringConverter } from "./string";

export function numberConverter(input: unknown): number | undefined {
  const v = parseInt(stringConverter(input) || "");
  return isNaN(v) ? undefined : v;
}
