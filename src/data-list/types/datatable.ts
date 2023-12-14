import type { z } from 'zod'
import type { VNodeChild } from 'vue'
import type { EllipsisProps, DataTableColumn as NDataTableColumn } from 'naive-ui'
import type {
  Action,
  DataApi,
  DataDefaultSort,
  DataSortOption,
  DataSource,
  DynamicFilter,
  OptimizedQueryField,
  RowAction,
  StaticFilter,
} from './shared'
import type {
  GenericObject,
  MaybePromise,
  NestedPaths,
  NestedPathsForType,
} from '@/_shared/types/utils'

export type TDataTableColumn = NDataTableColumn & { summary?: ColumnSummary[] }

export type ColumnSummary<
  Data extends GenericObject = GenericObject,
> = {
  value: VNodeChild | ((data: Data[]) => VNodeChild)
  colSpan?: number
  rowSpan?: number
}

export type DataTableColumnGroup<
  Data extends GenericObject = GenericObject,
  KeyPaths extends string = string,
> = {
  // eslint-disable-next-line ts/ban-types
  key: KeyPaths | (string & {})
  label: string | (() => VNodeChild)
  condition?: () => boolean
  children: Array<
    DataTableColumn<Data, KeyPaths> | DataTableColumnGroup<Data, KeyPaths>
  >
  fixed?: 'left' | 'right' | false
  resizable?: boolean
}

export type DataTableColumn<
  TData extends GenericObject = GenericObject,
  KeyPaths extends string = string,
> = {
  label: string | (() => VNodeChild)
  key: KeyPaths
  render?: (rowData: TData, rowIndex: number) => VNodeChild
  ellipsis?: boolean | EllipsisProps
  ellipsisComponent?: 'ellipsis' | 'performant-ellipsis'
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  condition?: () => boolean
  fixed?: 'left' | 'right'
  cellProps?: (rowData: TData, rowIndex: number) => object
  colSpan?: (rowData: object, rowIndex: number) => number
  rowSpan?: (rowData: object, rowIndex: number) => number
  labelRowSpan?: (rowData: object, rowIndex: number) => number
  align?: 'left' | 'right' | 'center'
  labelAlign?: 'left' | 'right' | 'center'
  resizable?: boolean
  summary?: ColumnSummary<TData>[]
}

export interface DataTableSchema<
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
  PathKeys extends string = NestedPaths<TData>,
  KeyablePathKeys extends string = NestedPathsForType<TData, string | number>,
> {
  rowIdKey?: KeyablePathKeys
  tableKey: string
  remote: Remote
  datasource: Source
  columns: Array<
    DataTableColumn<TData, PathKeys> | DataTableColumnGroup<TData, PathKeys>
  >
  expandable?: (params: { rowData: TData, tableApi: DataApi }) => boolean
  expandedContent?: (params: { rowData: TData, tableApi: DataApi }) => VNodeChild
  optimizeQuery?: OptimizedQueryField<PathKeys>[]
  actions?: Action<TData, PathKeys>[]
  rowActions?: RowAction<TData, PathKeys>[]
  selection?: boolean
  pagination?: boolean
  sortOptions?: DataSortOption<PathKeys>[]
  searchQuery?: PathKeys[]
  staticFilters?: StaticFilter[]
  filters?: DynamicFilter[]
  defaultSort?: DataDefaultSort<PathKeys>
  persistency?: false | 'localStorage' | 'sessionStorage'
  defaultPageSize?: number
  maxHeight?: string
  compact?: boolean
  frameless?: boolean
}

export type RuntimeColumnsConfig = z.infer<typeof RUNTIME_COLS_CONFIG_SCHEMA>
