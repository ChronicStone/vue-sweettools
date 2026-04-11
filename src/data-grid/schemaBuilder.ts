import type { DataGridSchema, GridItem, VirtualStoreItem } from "./types";
import type {
  DeepRequired,
  GenericObject,
  NestedPaths,
} from "@/_shared/types/utils";

export type GridSchemaInput<
  T extends GenericObject,
  Key = NestedPaths<DeepRequired<T>>,
> = {
  virtualStore?: Record<string, VirtualStoreItem>;
  gridColSize?: string | number;
  gridRowSize?: string | number;
  fields: GridItem<T, Key>[];
};

export function buildGridSchema<const T extends GenericObject>(
  schema: GridSchemaInput<T>,
): GridSchemaInput<T> {
  return schema;
}
