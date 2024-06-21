import type { MaybePromise } from 'rollup'
import type { CSSProperties, VNodeChild } from 'vue'
import type { AppTypes } from '@/_shared/types/lib'
import type { GenericObject, LooseString, NestedPaths, NestedPathsForType } from '@/_shared/types/utils'
import type { CascaderField, CheckboxField, ColorPickerField, DateField, FormField, NumberField, PasswordField, RadioField, RatingField, SelectField, SliderField, SwitchField, TagField, TextAreaField, TextField, TimeField, TreeSelectField, _BaseField } from '@/form/types/fields'

export type Operator = 'AND' | 'OR' | (() => 'AND' | 'OR')

export type FilterMatchMode =
  | 'contains'
  | 'between'
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'exists'
  | 'objectStringMap'
  | 'arrayLength'
  | 'objectMatch'

export type NonObjectMatchMode = Exclude<FilterMatchMode, 'objectStringMap' | 'objectMatch'>
export type ComparatorMatchMode = Extract<FilterMatchMode, 'between' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual'>

export type ComparatorParams = {
  dateMode?: boolean
}

export type ObjectMapFilterParams = {
  operator: 'AND' | 'OR'
  properties: Array<{
    key: string
    matchMode: Exclude<FilterMatchMode, 'objectStringMap' | 'objectMap'>
  }>
  transformFilterValue?: (value: any) => any
  matchPropertyAtIndex?: boolean
}

export type ObjectStringMapFilterParams = {
  stringMap: Array<
    | string
    | {
      propertyName: string
      matchMode: Exclude<FilterMatchMode, 'objectStringMap'>
    }
    >
  stringMapSeparator?: string
  stringMapOperator?: 'AND' | 'OR'
  dateMode?: boolean
}

export type MatchModeCore = ({
  matchMode: Exclude<FilterMatchMode, 'objectStringMap' | 'objectMatch' | ComparatorMatchMode>
} | {
  matchMode: ComparatorMatchMode
  params?: ComparatorParams
} | {
  matchMode: 'objectStringMap'
  params: ObjectStringMapFilterParams
} | {
  matchMode: 'objectMatch'
  params: ObjectMapFilterParams | ((value: any) => ObjectMapFilterParams)
})

export type StaticFilter<KeyPaths extends string = string> = {
  key: LooseString<KeyPaths>
  value: any
  required?: boolean
  postCondition?: boolean
  arrayLookup?: Operator
  params?: Record<string, any>
  lookupAtRoot?: boolean
} & MatchModeCore

export interface OptimizedQueryField<KeyPath = string> {
  field: KeyPath
  externalDocument?: boolean
}

export type DynamicFilter = FormField & {
  matchMode?: FilterMatchMode
  arrayLookup?: Operator
  postCondition?: boolean
  params?: Record<string, any>
  lookupAtRoot?: boolean
} & MatchModeCore

export type QuickFilterPrimitive = string | number | boolean | null | undefined
export type QuickFilterObject = { label: string | (() => VNodeChild); value: QuickFilterPrimitive }
export type QuickFilterOptions = QuickFilterPrimitive[] | QuickFilterObject[] | (() => MaybePromise<QuickFilterPrimitive[] | QuickFilterObject[]>)

export type QuickFilter<KeyPaths extends string = string> = {
  type: 'toggle-list' | 'select-list'
  label: string
  key: KeyPaths
  options: QuickFilterOptions
  multiple?: boolean
  condition?: () => boolean
  default?: QuickFilterPrimitive[] | QuickFilterPrimitive
  transform?: (value: any) => any
} & ({
  matchMode: Exclude<FilterMatchMode, 'objectStringMap' | 'objectMatch' | ComparatorMatchMode>
} | {
  matchMode: ComparatorMatchMode
  params?: ComparatorParams
})

export type MappedFilters = {
  value: any
  required?: boolean | undefined
  postCondition?: boolean
  arrayLookup?: Operator
  lookupAtRoot?: boolean
} & MatchModeCore

export type FilterBuilderPropertyField = Omit<_BaseField, 'key' | 'label'> & (
  | TextField
  | TextAreaField
  | PasswordField
  | SelectField
  | NumberField
  | ColorPickerField
  | SliderField
  | SwitchField
  | RadioField
  | CheckboxField
  | TimeField
  | DateField
  | TreeSelectField
  | CascaderField
  | RatingField
  | TagField
)

export type FilterBuilderProperty = {
  label: string | (() => VNodeChild)
  key: string
  matchModes?: NonObjectMatchMode[]
  metadataFields?: Array<FilterBuilderPropertyField & { matchMode?: NonObjectMatchMode }>
  field: FilterBuilderPropertyField | ((matchMode: NonObjectMatchMode) => FilterBuilderPropertyField)
}

export type FilterBuilderParams = {
  label: string | (() => VNodeChild)
  key?: string
  defaultOperator?: 'AND' | 'OR'
  properties: Array<FilterBuilderProperty>
}

export type FilterBuilderRawValue = {
  propertyName: string
  matchMode: NonObjectMatchMode
  value: any
  metadata?: Record<string, any>
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

export type TableData<Source extends DataSource> = Source extends DataSource<infer T, true>
  ? T
  : Source extends DataSource<infer T, false>
    ? T
    : never

export type InferTableParams<Source extends DataSource, Data extends TableData<Source> = TableData<Source>> = {
  data: Data
  keyPaths: NestedPaths<Data>
  keyableKeyPaths: NestedPathsForType<Data, string | number>
}

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
  icon?: string
  action?: (actionParams: TParams) => void
  link?: string | AppTypes['routeLocation']
  permissions?: (AppTypes['permissionKey'] | AppTypes['permissionKey'][])[]
  condition?: (data: T[], params: TParams) => boolean
}

export type ActionGroup<
  T extends GenericObject = GenericObject,
  KeyPath = any,
  TParams extends ActionParams<T, KeyPath> = ActionParams<T, KeyPath>,
> = {
  label: string
  icon?: string
  children: Array<Action<T, KeyPath, TParams> | ActionGroup<T, KeyPath, TParams>>
  condition?: (data: T[], params: TParams) => boolean
  permissions?: (AppTypes['permissionKey'] | AppTypes['permissionKey'][])[]
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
    quickFilters: GenericObject
  }
}

export type FullQueryState = ReturnType<typeof useQueryState>
export type DataResolverState = ReturnType<typeof useDataResolver>

export type SlotStyle = {
  headerStyle?: string | CSSProperties
  headerClass?: string | Array<string | Record<string, boolean>>
  footerStyle?: string | CSSProperties
  footerClass?: string | Array<string | Record<string, boolean>>
}
