import type { VNodeChild } from 'vue'
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
} from './shared'
import type { GenericObject } from '@/_shared/types/utils'

export interface DataListSchema<
  Remote extends boolean = boolean,
  Source extends DataSource<GenericObject, Remote> = DataSource<
    GenericObject,
    Remote
  >,
  Params extends InferTableParams<Source> = InferTableParams<Source>,

> extends SlotStyle {
  rowIdKey?: Params['keyPaths']
  remote: Remote
  datasource: Source
  content: (params: { rowData: Params['data']; tableApi: DataApi }) => VNodeChild
  expandedContent?: (params: { rowData: Params['data']; tableApi: DataApi }) => VNodeChild
  expandable?: (params: { rowData: Params['data']; tableApi: DataApi }) => boolean
  optimizeQuery?: OptimizedQueryField<Params['keyPaths']>[]
  staticFilters?: StaticFilter[]
  actions?: Action<Params['data'], Params['keyPaths']>[]
  rowActions?: RowAction<Params['data'], Params['keyPaths']>[]
  pagination?: boolean
  selection?: boolean
  sortOptions?: DataSortOption<Params['keyPaths']>[]
  searchQuery?: Params['keyPaths'][]
  filters?: DynamicFilter[]
  defaultSort?: DataDefaultSort<Params['keyPaths']>
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
  Params extends InferTableParams<Source>,
>(schema: DataListSchema<Remote, Source, Params>) {
  return schema as unknown as DataListSchema<
    boolean,
    DataSource<GenericObject, boolean>
  >
}
