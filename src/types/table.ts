import { FormField } from "@/types/form/fields";
import { GlobalTheme, GlobalThemeOverrides } from "naive-ui";
import { ComputedRef, DefineComponent, Ref, VNodeChild } from "vue";
import { DeepRequired, GenericObject, NestedPaths } from "@/types/utils";
import { AppTypes } from "./lib";
import { Column as AgGridColum } from "ag-grid-community";

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

export type TableFilter = FormField & {
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
};

export type StaticFilter = {
  key: string;
  value: any;
  required?: boolean;
  postCondition?: boolean;
  matchMode: FilterMatchMode;
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
};

export interface FilterState {
  [key: string]: string | number | boolean | any[] | object;
}

export interface Column<
  T extends GenericObject = GenericObject,
  Key = NestedPaths<DeepRequired<T>>
> {
  label: string;
  key?: Key;
  hide?: boolean;
  filter?: TableFilter;
  minWidth?: number | string;
  maxWidth?: number | string;
  fixed?: "left" | "right";
  width?: number | string;
  sortable?: boolean;
  resizable?: boolean;
  render?: (row: T) => VNodeChild | string;
  cellComponent?: DefineComponent<any, any, any>;
  cellComponentParams?: GenericObject;
  condition?: () => boolean;
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
  postCondition?: boolean;
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

export type DataSource<T, Remote extends boolean = boolean> = (
  params: FetchParams
) => Promise<
  Remote extends true
    ? {
        docs: T[];
        totalDocs: number;
        totalPages: number;
      }
    : Remote extends false
    ? T[]
    :
        | {
            docs: T[];
            totalDocs: number;
            totalPages: number;
          }
        | T[]
>;

export interface TableActionParams<T = GenericObject> {
  nbSelected: number;
  selectAll: boolean;
  selected: T[];
  fetchParams: FetchParams;
  tableApi: TableApi<T>;
}

export interface TableAction<T = GenericObject> {
  label: string;
  icon: string;
  action?: (actionParams: TableActionParams<T>) => void;
  link?: string | AppTypes["routeLocation"];
  permissions?: (AppTypes["permissionKey"] | AppTypes["permissionKey"][])[];
  condition?: (data: T[], params: TableActionParams<T>) => boolean;
}

export interface TableApi<T = Record<string, unknown>> {
  refreshData: () => void;
  setSearchQuery: (value: string) => void;
  resetFilters: () => void;
  setSort: (key: string, dir?: "asc" | "desc" | null) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  updateRow: (selector: (row: T) => boolean, updater: (row: T) => T) => boolean;
  updateRows: (
    selector: (row: T) => boolean,
    updater: (row: T) => T
  ) => boolean;
}

export type TableRowAction<T> = {
  icon: string | ((params: { rowData: T }) => string);
  tooltip: string | ((params: { rowData: T }) => string);
  action?: (params: { rowData: T; tableApi: TableApi<T> }) => void;
  link?:
    | string
    | AppTypes["routeLocation"]
    | ((params: { rowData: T }) => AppTypes["routeLocation"]);
  permissions?: (AppTypes["permissionKey"] | AppTypes["permissionKey"][])[];
  condition?: (params: { rowData: T; tableApi: TableApi<T> }) => boolean;
};

export type CellRendererParams<T = GenericObject> = {
  value: any;
  data: GenericObject;
  eGridCell: HTMLElement;
  tableApi: Ref<TableApi<T>>;
  theme: ComputedRef<GlobalTheme | null>;
  themeOverrides: ComputedRef<GlobalThemeOverrides | undefined>;
};

export type HeaderRendererParams<T = GenericObject> = {
  eGridHeader: HTMLElement;
  tableApi: Ref<TableApi<T>>;
  theme: ComputedRef<GlobalTheme | null>;
  themeOverrides: ComputedRef<GlobalThemeOverrides | undefined>;
  column: AgGridColum;
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

export interface DataTableSchema<
  TData extends GenericObject = GenericObject,
  Remote extends boolean = boolean
> {
  remote: Remote;
  draggable?: boolean;
  datasource: DataSource<TData, Remote>;
  columns: Column<TData>[];
  optimizeQuery?: OptimizedQueryField[];
  tableKey?: string;
  staticFilters?: StaticFilter[];
  filters?: TableFilter[];
  searchQuery?: Array<NestedPaths<DeepRequired<TData>>>;
  enableSelection?: boolean;
  actions?: TableAction<TData>[];
  rowActions?: TableRowAction<TData>[];
  columnFitMode?: "fit" | "fill";
  persistency?: false | "localStorage" | "sessionStorage";
  sort?:
    | NestedPaths<DeepRequired<TData>>
    | { key: NestedPaths<DeepRequired<TData>>; dir: "asc" | "desc" };
  onRowDrag?: (params: {
    rows: Array<TData>;
    movedRows: Array<TData>;
    tableApi: TableApi<TData>;
  }) => void;
}

export interface DataTableProps
  extends DataTableSchema<{ [key: string]: unknown }> {
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
