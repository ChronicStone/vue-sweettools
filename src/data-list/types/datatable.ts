import type { z } from 'zod'
import type { HTMLAttributes, VNodeChild } from 'vue'
import type { EllipsisProps, DataTableColumn as NDataTableColumn } from 'naive-ui'
import type {
  Action,
  ActionGroup,
  DataApi,
  DataDefaultSort,
  DataSortOption,
  DataSource,
  DynamicFilter,
  InferTableParams,
  OptimizedQueryField,
  QuickFilter,
  RowAction,
  SlotStyle,
  StaticFilter,
} from './shared'
import type {
  GenericObject,
  MaybePromise,
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
  key: KeyPaths
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
  cellProps?: (rowData: TData, rowIndex: number) => HTMLAttributes & { [key: `data-${string}`]: string }
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
  Params extends InferTableParams<Source> = InferTableParams<Source>,
> extends SlotStyle {
  rowIdKey?: Params['keyPaths']
  tableKey: string
  remote: Remote
  datasource: Source
  columns: Array<DataTableColumn<Params['data'], Params['keyPaths']> | DataTableColumnGroup<Params['data'], Params['keyPaths']>>
  searchQuery?: Params['keyPaths'][]

  expandable?: (params: { rowData: Params['data']; tableApi: DataApi<Params['data'], Params['keyPaths']> }) => boolean
  expandedContent?: (params: { rowData: Params['data']; tableApi: DataApi<Params['data'], Params['keyPaths']> }) => VNodeChild
  optimizeQuery?: OptimizedQueryField<Params['keyPaths']>[]
  actions?: Array<Action<Params['data'], Params['keyPaths']> | ActionGroup<Params['data'], Params['keyPaths']>>
  rowActions?: RowAction<Params['data'], Params['keyPaths']>[]
  selection?: boolean
  pagination?: boolean
  draggable?: boolean
  onRowDrag?: (rows: Params['data']) => MaybePromise<any>
  sortOptions?: DataSortOption<Params['keyPaths']>[]
  staticFilters?: StaticFilter[]
  filters?: DynamicFilter[]
  quickFilters?: QuickFilter<Params['keyPaths']>[]
  defaultSort?: DataDefaultSort<Params['keyPaths']>
  persistency?: false | 'localStorage' | 'sessionStorage'
  defaultPageSize?: number
  maxHeight?: string
  compact?: boolean
  frameless?: boolean
}

export type RuntimeColumnsConfig = z.infer<typeof RUNTIME_COLS_CONFIG_SCHEMA>
