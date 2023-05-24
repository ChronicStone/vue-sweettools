import { DeepRequired, GenericObject, NestedPaths } from "@/types/utils";
import { VNodeChild } from "vue";

export interface GridItem<
  T extends GenericObject = GenericObject,
  Key = NestedPaths<DeepRequired<T>>
> {
  label?: string | ((data: T) => VNodeChild);
  key: Key;
  render?: (params: {
    value: any;
    data: T;
    store: Record<string, unknown>;
  }) => VNodeChild;
  condition?: (params: {
    value: any;
    data: T;
    store: Record<string, unknown>;
  }) => boolean;
  ellipsis?: boolean;
  fieldColSize?: string | number;
  fieldRowSize?: string;
}

export type VirtualStoreItem = {
  value: unknown | (() => unknown | Promise<unknown>);
};

export type DataGridSchema<T extends GenericObject = GenericObject> = {
  virtualStore?: Record<string, VirtualStoreItem>;
  gridColSize?: string | number;
  gridRowSize?: string | number;
  fields: GridItem<T>[];
};

export interface DataGridProps<T extends GenericObject = GenericObject> {
  virtualStore?: Record<string, VirtualStoreItem>;
  gridColSize?: string | number;
  gridRowSize?: string | number;
  data: GenericObject | null | undefined;
  fields: GridItem<T>[];
}
