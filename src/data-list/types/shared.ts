import type { MaybePromise } from 'rollup'
import type { VNodeChild } from 'vue'
import type { AppTypes } from '@/_shared/types/lib'
import type { GenericObject } from '@/_shared/types/utils'
import type { FormField } from '@/form/types/fields'

export type FilterMatchMode =
  | 'arrayContains'
  | 'contains'
  | 'between'
  | 'equals'
  | 'exists'
  | 'objectStringMap'
  | 'arrayLength'
  | 'arrayContainsObject'

export type StaticFilter = {
  key: string
  value: any
  required?: boolean
  postCondition?: boolean
  matchMode: FilterMatchMode
  params?: {
    stringMap?: Array<
      | string
      | {
        propertyName: string
        matchMode: Omit<FilterMatchMode, 'objectStringMap'>
      }
    >
    stringMapSeparator?: string
    stringMapOperator?: 'AND' | 'OR'
    dateMode?: boolean
  }
}

export interface OptimizedQueryField<KeyPath = string> {
  field: KeyPath
  externalDocument?: boolean
}

export type DynamicFilter = FormField & {
  matchMode?: FilterMatchMode
  params?: {
    stringMap?: Array<
      | string
      | {
        propertyName: string
        matchMode: Omit<FilterMatchMode, 'objectStringMap'>
      }
    >
    stringMapSeparator?: string
    stringMapOperator?: 'AND' | 'OR'
    dateMode?: boolean
  }
  postCondition?: boolean
}

export type MappedFilters = {
  value: any
  matchMode: FilterMatchMode
  required?: boolean | undefined
  params: DynamicFilter['params']
  postCondition?: boolean
}

export type FetchParams = {
  page: number
  limit: number
  sortKey: string | null
  sortOrder: 'asc' | 'desc' | '' | null
  searchQuery: null | {
    value: string | null
    fields: string[]
  }
  query: null | Record<string, MappedFilters[]>
  fields?: DynamicFilter[]
}

export type DataSource<
  T extends GenericObject = GenericObject,
  Remote extends boolean = boolean,
> = Remote extends true
  ? (params: FetchParams) => MaybePromise<{
    docs: T[]
    totalDocs: number
    totalPages: number
  }>
  : () => MaybePromise<T[]>

export type RemoteDataSource<
  T extends GenericObject = GenericObject,
  > = DataSource<T, true>

export type ActionParams<
  T extends GenericObject = GenericObject,
  KeyPath = any,
> = {
  nbSelected: number
  selectAll: boolean
  selected: T[]
  fetchParams: FetchParams
  tableApi: DataApi<T, KeyPath>
}

export type Action<
  T extends GenericObject = GenericObject,
  KeyPath = any,
  TParams extends ActionParams<T, KeyPath> = ActionParams<T, KeyPath>,
> = {
  label: string
  icon: string
  action?: (actionParams: TParams) => void
  link?: string | AppTypes['routeLocation']
  permissions?: (AppTypes['permissionKey'] | AppTypes['permissionKey'][])[]
  condition?: (data: T[], params: TParams) => boolean
}

export type DataApi<T = GenericObject, KeyPath = any> = {
  refreshData: () => void
  setSearchQuery: (value: string) => void
  resetFilters: () => void
  setSort: (key: KeyPath, dir?: 'asc' | 'desc' | null) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  updateRow: (selector: (row: T) => boolean, updater: (row: T) => T) => boolean
  updateRows: (
    selector: (row: T) => boolean,
    updater: (row: T) => T
  ) => boolean
}

export type RowAction<T = GenericObject, KeyPath = any> = {
  icon: string | ((params: { rowData: T }) => string)
  label: string | ((params: { rowData: T }) => string)
  action?: (params: { rowData: T; tableApi: DataApi<T, KeyPath> }) => void
  link?:
  | string
  | AppTypes['routeLocation']
  | ((params: { rowData: T }) => AppTypes['routeLocation'])
  permissions?: (AppTypes['permissionKey'] | AppTypes['permissionKey'][])[]
  condition?: (params: { rowData: T; tableApi: DataApi<T> }) => boolean
}

export type DataSortOption<KeyPaths = any> = {
  label: string | (() => VNodeChild)
  key: KeyPaths
}

export type DataDefaultSort<KeyPaths = any> =
  | KeyPaths
  | { key: KeyPaths; dir: 'asc' | 'desc' }

export type DataQueryState = {
  sort: {
    colId: string
    key: string
    dir: 'asc' | 'desc' | null
  }
  pagination: {
    pageIndex: number
    pageSize: number
    pageTotalCount: number
    rowTotalCount: number
  }
  filters: {
    searchQuery: string
    panelFilters: GenericObject
    staticFilters: GenericObject
  }
}

export type FullQueryState = ReturnType<typeof useQueryState>
export type DataResolverState = ReturnType<typeof useDataResolver>
