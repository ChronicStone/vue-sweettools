import type {
  Action,
  ActionGroup,
  DataApi,
  DataDefaultSort,
  DataSortOption,
  DynamicFilter,
  FetchParams,
  FilterBuilderProperty,
  OptimizedQueryField,
  QuickFilter,
  RowAction,
  SlotStyle,
  StaticFilter,
} from "../types/shared";
import type { DataTableColumn, DataTableColumnGroup } from "../types/datatable";
import type {
  MaybePromise,
  NestedPaths,
  NestedPathsForType,
} from "@/_shared/types/utils";
import type { VNodeChild } from "vue";

type LocalSource<TData> = () => MaybePromise<TData[]>;
type RemoteSource<TData> = (params: FetchParams) => MaybePromise<{
  docs: TData[];
  totalDocs: number;
  totalPages: number;
}>;

type SourceData<Source> =
  Source extends RemoteSource<infer TData>
    ? TData
    : Source extends LocalSource<infer TData>
      ? TData
      : never;

type SourceParams<Source> = {
  data: SourceData<Source>;
  keyPaths: NestedPaths<SourceData<Source>>;
  keyableKeyPaths: NestedPathsForType<SourceData<Source>, string | number>;
};

export type TableSchemaInput<
  Remote extends boolean,
  Source extends Remote extends true ? RemoteSource<any> : LocalSource<any>,
  Params extends SourceParams<Source> = SourceParams<Source>,
> = SlotStyle & {
  rowIdKey?: Params["keyPaths"];
  tableKey: string;
  remote: Remote;
  datasource: Source;
  columns: Array<
    | DataTableColumn<Params["data"], Params["keyPaths"]>
    | DataTableColumnGroup<Params["data"], Params["keyPaths"]>
  >;
  searchQuery?: Params["keyPaths"][];
  expandable?: (params: {
    rowData: Params["data"];
    tableApi: DataApi<Params["data"], Params["keyPaths"]>;
  }) => boolean;
  expandedContent?: (params: {
    rowData: Params["data"];
    tableApi: DataApi<Params["data"], Params["keyPaths"]>;
  }) => VNodeChild;
  optimizeQuery?: OptimizedQueryField<Params["keyPaths"]>[];
  actions?: Array<
    | Action<Params["data"], Params["keyPaths"]>
    | ActionGroup<Params["data"], Params["keyPaths"]>
  >;
  rowActions?: RowAction<Params["data"], Params["keyPaths"]>[];
  selection?: boolean;
  pagination?: boolean;
  draggable?: boolean;
  onRowDrag?: (rows: Params["data"]) => MaybePromise<any>;
  sortOptions?: DataSortOption<Params["keyPaths"]>[];
  staticFilters?: StaticFilter[];
  filters?: DynamicFilter[];
  quickFilters?: QuickFilter<Params["keyPaths"]>[];
  defaultSort?: DataDefaultSort<Params["keyPaths"]>;
  persistency?: false | "localStorage" | "sessionStorage";
  defaultPageSize?: number;
  maxHeight?: string;
  compact?: boolean;
  frameless?: boolean;
};

export type ListSchemaInput<
  Remote extends boolean,
  Source extends Remote extends true ? RemoteSource<any> : LocalSource<any>,
  Params extends SourceParams<Source> = SourceParams<Source>,
> = SlotStyle & {
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
};

export function buildTableSchema<
  const Source extends LocalSource<any>,
  const Params extends SourceParams<Source>,
>(
  schema: TableSchemaInput<false, Source, Params>,
): TableSchemaInput<false, Source, Params>;
export function buildTableSchema<
  const Source extends RemoteSource<any>,
  const Params extends SourceParams<Source>,
>(
  schema: TableSchemaInput<true, Source, Params>,
): TableSchemaInput<true, Source, Params>;
export function buildTableSchema(schema: TableSchemaInput<boolean, any, any>) {
  return schema;
}

export function buildListSchema<
  const Source extends LocalSource<any>,
  const Params extends SourceParams<Source>,
>(
  schema: ListSchemaInput<false, Source, Params>,
): ListSchemaInput<false, Source, Params>;
export function buildListSchema<
  const Source extends RemoteSource<any>,
  const Params extends SourceParams<Source>,
>(
  schema: ListSchemaInput<true, Source, Params>,
): ListSchemaInput<true, Source, Params>;
export function buildListSchema(schema: ListSchemaInput<boolean, any, any>) {
  return schema;
}

export function defineFilterProperty(params: FilterBuilderProperty) {
  return params;
}
