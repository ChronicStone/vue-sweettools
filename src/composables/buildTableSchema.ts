import { DataTableSchema } from "@/types/table";
import { GenericObject } from "@/types/utils";

export function buildTableSchema<T extends GenericObject>(
  schema: DataTableSchema<T>
) {
  return schema as unknown as DataTableSchema<GenericObject>;
}
