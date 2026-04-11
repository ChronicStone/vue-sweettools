import type { DataGridSchema } from "./types";
import type { GenericObject } from "@/_shared/types/utils";

type NoInfer<T> = [T][T extends any ? 0 : never];

export function buildGridSchema<T extends GenericObject>(
  schema: NoInfer<DataGridSchema<T>>,
): DataGridSchema<T> {
  return schema;
}
