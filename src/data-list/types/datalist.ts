import type { VNodeChild } from "vue";
import type {
  Action,
  DataApi,
  DataDefaultSort,
  DataSortOption,
  DataSource,
  DynamicFilter,
  InferTableParams,
  OptimizedQueryField,
  RowAction,
  SlotStyle,
  StaticFilter,
} from "./shared";
import type { GenericObject } from "@/_shared/types/utils";

export interface DataListSchema<
  Remote extends boolean = boolean,
  Source extends DataSource<GenericObject, Remote> = DataSource<
    GenericObject,
    Remote
  >,
  Params extends InferTableParams<Source> = InferTableParams<Source>,
> extends SlotStyle {
  rowIdKey?: Params["keyPaths"];
  remote: Remote;
  datasource: Source;
  content: (params: {
    rowData: Params["data"];
    tableApi: DataApi<Params["data"], Params["keyPaths"]>;
  }) => VNodeChild;
  expandedContent?: (params: {
    rowData: Params["data"];
    tableApi: DataApi<Params["data"], Params["keyPaths"]>;
  }) => VNodeChild;
  expandable?: (params: {
    rowData: Params["data"];
    tableApi: DataApi<Params["data"], Params["keyPaths"]>;
  }) => boolean;
  optimizeQuery?: OptimizedQueryField<Params["keyPaths"]>[];
  staticFilters?: StaticFilter[];
  actions?: Action<Params["data"], Params["keyPaths"]>[];
  rowActions?: RowAction<Params["data"], Params["keyPaths"]>[];
  pagination?: boolean;
  selection?: boolean;
  sortOptions?: DataSortOption<Params["keyPaths"]>[];
  searchQuery?: Params["keyPaths"][];
  filters?: DynamicFilter[];
  defaultSort?: DataDefaultSort<Params["keyPaths"]>;
  persistency?: false | "localStorage" | "sessionStorage";
  listKey?: string;
  defaultPageSize?: number;
  maxHeight?: false | string;
  compact?: boolean;
  frameless?: boolean;
}
