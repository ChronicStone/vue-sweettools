import { GlobalTheme, GlobalThemeOverrides } from "naive-ui";
import { ComputedRef, Ref, VNodeChild, WritableComputedRef } from "vue";
import {
  DeepRequired,
  GenericObject,
  NestedPaths,
  Primitive,
  TypeFromPath,
} from "@/types/utils";
import { RouteLocationRaw } from "vue-router";

export type FilterMatchMode =
  | "arrayContains"
  | "contains"
  | "between"
  | "equals"
  | "exists"
  | "objectStringMap"
  | "arrayLength"
  | "arrayContainsObject";
export type FilterType =
  | "text"
  | "select"
  | "slider"
  | "cascader"
  | "tree-select"
  | "checkbox"
  | "checkbox-group"
  | "number"
  | "radio"
  | "daterange"
  | "array"; // | "time" | "date" | "datetime" | "daterange" | "datetimerange" | "month" | "year" | "quarter";

export interface SelectOptions {
  label: string;
  value: any;
}

export interface OptimizedQueryField {
  field: string;
  externalDocument?: boolean;
}

export type FilterFactory = (key: string, ...args: any[]) => TableFilter;

export interface TableFilter {
  condition?: (params: TableActionParams) => boolean;
  label?: string | ((dependencies?: GenericObject) => string | VNodeChild);
  key: string;
  type: FilterType;
  options?:
    | SelectOptions[]
    | ((
        dependencies?: GenericObject | undefined
      ) => SelectOptions[] | Promise<SelectOptions[]>);
  placeholder?: string;
  default?: any;
  dependencies?: (string | string[])[];
  fields?: Omit<TableFilter, "type">[];
  format?: "list" | "tabs" | "table";
  size?: number | string;
  fieldParams?: GenericObject;
  preformat?: (value: any) => any;
  transform?: (value: any) => any;
  matchMode?: FilterMatchMode;
  params?: {
    stringMap?: Array<
      | string
      | {
          propertyName: string;
          matchMode: Omit<FilterMatchMode, "objectStringMap">;
        }
    >;
    stringMapSeparator?: string;
    stringMapOperator?: "AND" | "OR";
    dateMode?: boolean;
  };
  postCondition?: boolean;
}

export interface StaticFilter {
  key: string;
  matchMode: FilterMatchMode;
  value: any;
  required?: boolean;
  params?: TableFilter["params"];
}

export interface FilterState {
  [key: string]: string | number | boolean | any[] | object;
}

export interface Column<
  T extends GenericObject = GenericObject,
  Key = NestedPaths<DeepRequired<T>>
> {
  label: string;
  key: Key;
  hide?: boolean;
  filter?: TableFilter;
  width?: number | string;
  sortable?: boolean;
  resizable?: boolean;
  render?: (value: any, row: T, params: GenericObject) => VNodeChild | string;
  cellComponent?: GenericObject;
  cellComponentParams?: GenericObject;
  condition?: (params: TableActionParams) => boolean;
}

// type PickTypeFromPath<
//   T extends Record<Primitive, Narrowable>,
//   Path extends NestedPaths<DeepRequired<T>>
// > = Path extends keyof T
//   ? T[Path]
//   : Path extends `${infer P}.${infer K}`
//   ? PickTypeFromPath<{ [Key in keyof T[keyof T]]: T[keyof T][Key] }, K>
//   : never;

// type User = {
//   test: {
//     firstName: string | number;
//     somePerson: Array<{ firstName: string; index: 1}>
//   };
// };

// const column: Column<User> = {
//   key: 'test.somePerson',
//   render: (value) => value.
// }

export interface MappedFilters {
  value: any;
  matchMode: FilterMatchMode;
  required?: boolean | undefined;
  params: TableFilter["params"];
}

export interface FetchParams {
  page: number;
  limit: number;
  sortKey: string | null;
  sortOrder: "asc" | "desc" | "" | null;
  searchQuery: null | {
    value: string | null;
    fields: string[];
  };
  query: null | Record<string, MappedFilters[]>;
  fields?: OptimizedQueryField[];
}

export interface ActionParams {
  nbSelected: number;
  selectAll?: boolean;
  selected?: any[];
  fetchParams?: FetchParams;
}

export type RemoteTableData<T extends GenericObject> = {
  docs: T[];
  totalDocs: number;
  totalPages: number;
};

export type DataSource<T, Y extends "remote" | "local" | null = null> = (
  params: FetchParams
) => Promise<
  Y extends "remote"
    ? {
        docs: T[];
        totalDocs: number;
        totalPages: number;
      }
    : Y extends "local"
    ? T[]
    :
        | {
            docs: T[];
            totalDocs: number;
            totalPages: number;
          }
        | T[]
>;

export interface TableActionParams {
  nbSelected: number;
  selectAll: boolean;
  selected: any[];
  fetchParams: FetchParams;
  tableApi: TableApi;
}

export interface TableAction<T = GenericObject> {
  label: string;
  icon: string;
  action?: (actionParams: TableActionParams) => void;
  link?: string | RouteLocationRaw;
  permissions?: (string | string[])[];
  condition?: (data: T[], params: TableActionParams) => boolean;
}

export interface TableApi {
  refreshData: () => void;
  setSearchQuery: (value: string) => void;
  resetFilters: () => void;
  setSort: (key: string, dir?: "asc" | "desc" | null) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export type TableRowAction<T> = {
  icon: string | ((params: { rowData: T }) => string);
  tooltip: string | ((params: { rowData: T }) => string);
  action?: (params: { rowData: T; tableApi: TableApi }) => void;
  link?:
    | string
    | RouteLocationRaw
    | ((params: { rowData: T }) => string | RouteLocationRaw);
  permissions?: (string | string[])[];
  condition?: (params: { rowData: T; tableApi: TableApi }) => boolean;
};

export type CellRendererParams = {
  value: any;
  data: GenericObject;
  eGridCell: HTMLElement;
  tableApi: Ref<TableApi>;
  theme: ComputedRef<GlobalTheme | null>;
  themeOverrides: ComputedRef<GlobalThemeOverrides | undefined>;
};

export type HeaderRendererParams = {
  eGridHeader: HTMLElement;
  tableApi: Ref<TableApi>;
  theme: ComputedRef<GlobalTheme | null>;
  themeOverrides: ComputedRef<GlobalThemeOverrides | undefined>;
};

export interface GridContent {
  selectAll?: boolean;
  data: any[];
  selected: any[];
  nbSelected?: ComputedRef<number>;
}

export interface GridControls {
  sort: {
    colId: string;
    key: string;
    dir: "asc" | "desc" | null;
  };
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageTotalCount: number;
    rowTotalCount: number;
  };
  filters: {
    searchQuery: string;
    panelFilters: GenericObject;
    staticFilters: GenericObject;
  };
}

export interface DataTableSchema<T extends GenericObject = GenericObject> {
  remote: boolean;
  datasource: DataSource<T>;
  columns: Column<T>[];
  optimizeQuery?: OptimizedQueryField[];
  tableKey?: string;
  staticFilters?: StaticFilter[];
  filters?: TableFilter[];
  searchQuery?: Array<NestedPaths<DeepRequired<T>>>;
  enableSelection?: boolean;
  actions?: TableAction[];
  rowActions?: TableRowAction<T>[];
  columnFitMode?: "fit" | "fill";
  persistency?: false | "localStorage" | "sessionStorage";
}

export interface DataTableProps extends DataTableSchema<any> {
  dark?: boolean;
  themeOverrides?: GlobalThemeOverrides;
}

export type DataTableFactory<T extends GenericObject = GenericObject> = (
  ...args: any[]
) => DataTableSchema<T>;

export interface ThemeConfig {
  themeOverrides?: Record<string, any>;
  dark: boolean;
}
