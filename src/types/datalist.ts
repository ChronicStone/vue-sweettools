import { VNodeChild } from "vue";
import {
  DeepRequired,
  GenericObject,
  MaybePromise,
  NestedPaths,
  NestedPathsForType,
} from "./utils";
import {
  DataSource,
  StaticFilter,
  TableAction,
  TableApi,
  TableFilter,
} from "./table";

export type DataListApi<
  T extends GenericObject = GenericObject,
  KeyPath = any
> = TableApi<T, KeyPath>;
export type DataListSortOption<KeyPaths> = {
  label: string | (() => VNodeChild);
  key: KeyPaths;
};

export type DataListRowAction<TData extends GenericObject = GenericObject> = {
  label: string | (() => VNodeChild);
  icon?: string;
  condition?: (data: TData) => boolean;
  action: (data: TData) => void;
};

export interface DataListSchema<
  Remote extends boolean = boolean,
  Source extends DataSource<GenericObject, Remote> = DataSource<
    GenericObject,
    Remote
  >,
  TData extends GenericObject = Source extends (
    ...args: any[]
  ) => MaybePromise<{
    docs: Array<infer T extends GenericObject>;
  }>
    ? T
    : Source extends () => MaybePromise<Array<infer T extends GenericObject>>
    ? T
    : never,
  PathKeys = NestedPaths<TData>,
  KeyablePathKeys = NestedPathsForType<TData, string | number>
> {
  rowIdKey?: KeyablePathKeys;
  remote: Remote;
  datasource: Source;
  title: (params: { rowData: TData }) => VNodeChild;
  subtitle?: (params: { rowData: TData }) => VNodeChild;
  image?: (params: { rowData: TData }) => VNodeChild;
  description?: (params: { rowData: TData }) => VNodeChild;
  expandedContent?: (params: { rowData: TData }) => VNodeChild;
  expendable?: (params: { rowData: TData }) => boolean;
  staticFilters?: StaticFilter[];
  actions?: TableAction<TData, PathKeys>[];
  rowActions?: DataListRowAction<TData>[];
  pagination?: boolean;
  selection?: boolean;
  sortOptions?: DataListSortOption<PathKeys>[];
  searchQuery?: PathKeys[];
  filters?: TableFilter[];
  defaultSort?: PathKeys | { key: PathKeys; dir: "asc" | "desc" };
  persistency?: false | "localStorage" | "sessionStorage";
  listKey?: string;
  defaultPageSize?: number;
  maxHeight?: false | string;
}
// & (
//   | {
//       persistency?: false;
//     }
//   | {
//       persistency: "localStorage" | "sessionStorage";
//       listKey: string;
//     }
// );

buildListSchema({
  remote: false,
  title: ({ rowData }) => rowData.id,
  searchQuery: ["id", "name"],
  sortOptions: [{ label: "Name", key: "id" }],
  datasource: () => [
    {
      id: 1,
      name: "test",
      age: 12,
      test: { test: "test" },
      test2: "test",
      test3: { test: "test" },
      test4: { test: { test: "test" } },
    },
    { id: 2, name: "test2", age: 12 },
  ],
  persistency: "localStorage",
  listKey: "test",
});

export function buildListSchema<
  Remote extends boolean,
  Source extends DataSource<GenericObject, Remote>
>(schema: DataListSchema<Remote, Source>) {
  return schema as unknown as DataListSchema<
    boolean,
    DataSource<GenericObject, boolean>
  >;
}
