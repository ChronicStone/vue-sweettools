import type { CSSProperties, VNodeChild } from 'vue'
import type {
  Action,
  DataApi,
  DataDefaultSort,
  DataSortOption,
  DataSource,
  DynamicFilter,
  OptimizedQueryField,
  RowAction,
  SlotStyle,
  StaticFilter,
} from './shared'
import type {
  GenericObject,
  MaybePromise,
  NestedPaths,
  NestedPathsForType,
} from '@/_shared/types/utils'

export interface DataListSchema<
  Remote extends boolean = boolean,
  Source extends DataSource<GenericObject, Remote> = DataSource<
    GenericObject,
    Remote
  >,
  TData extends GenericObject = Source extends (
    ...args: any[]
  ) => MaybePromise<{
    docs: Array<infer T extends GenericObject>
  }>
    ? T
    : Source extends () => MaybePromise<Array<infer T extends GenericObject>>
      ? T
      : never,
  PathKeys = NestedPaths<TData>,
  KeyablePathKeys = NestedPathsForType<TData, string | number>,
> extends SlotStyle {
  rowIdKey?: KeyablePathKeys
  remote: Remote
  datasource: Source
  content: (params: { rowData: TData; tableApi: DataApi }) => VNodeChild
  expandedContent?: (params: { rowData: TData; tableApi: DataApi }) => VNodeChild
  expandable?: (params: { rowData: TData }) => boolean
  optimizeQuery?: OptimizedQueryField<PathKeys>[]
  staticFilters?: StaticFilter[]
  actions?: Action<TData, PathKeys>[]
  rowActions?: RowAction<TData, PathKeys>[]
  pagination?: boolean
  selection?: boolean
  sortOptions?: DataSortOption<PathKeys>[]
  searchQuery?: PathKeys[]
  filters?: DynamicFilter[]
  defaultSort?: DataDefaultSort<PathKeys>
  persistency?: false | 'localStorage' | 'sessionStorage'
  listKey?: string
  defaultPageSize?: number
  maxHeight?: false | string
  compact?: boolean
  frameless?: boolean
}

export function buildListSchema<
  Remote extends boolean,
  Source extends DataSource<GenericObject, Remote>,
>(schema: DataListSchema<Remote, Source>) {
  return schema as unknown as DataListSchema<
    boolean,
    DataSource<GenericObject, boolean>
  >
}
