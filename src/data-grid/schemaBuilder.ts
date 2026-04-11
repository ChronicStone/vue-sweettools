import type { DataGridSchema } from "./types";

export function buildGridSchema<T extends DataGridSchema<any>>(schema: T): T {
  return schema;
}
