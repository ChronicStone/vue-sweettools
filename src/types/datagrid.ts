import { DeepRequired, GenericObject, NestedPaths } from "@/types/utils";
import { VNodeChild } from "vue";

export interface GridItem<
  T extends GenericObject,
  Key = NestedPaths<DeepRequired<T>>
> {
  label?: string | ((data: T) => VNodeChild);
  key: Key;
  render?: (value: any, data: T) => VNodeChild;
  condition?: (value: any, data: T) => boolean;
  ellipsis?: boolean;
  fieldColSize?: string | number;
  fieldRowSize?: string;
}

export type DataGridSchema<T extends GenericObject = GenericObject> = {
  fields: GridItem<T>[];
};

export interface DataGridProps {
  gridColSize?: string | number;
  gridRowSize?: string | number;
  data: GenericObject | null | undefined;
  fields: GridItem<GenericObject>[];
}
