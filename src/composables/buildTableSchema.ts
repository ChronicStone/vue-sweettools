import { DataGridSchema } from "@/types/datagrid";
import { DataSource, DataTableSchema } from "@/types/table";
import { GenericObject } from "@/types/utils";

export function buildTableSchema<
  Remote extends boolean,
  Source extends DataSource<GenericObject, Remote>
>(schema: DataTableSchema<Remote, Source>) {
  return schema as unknown as DataTableSchema<
    boolean,
    DataSource<GenericObject, Remote>
  >;
}

export function buildGridSchema<T extends GenericObject>(
  schema: DataGridSchema<T>
) {
  return schema as unknown as DataGridSchema<GenericObject>;
}
