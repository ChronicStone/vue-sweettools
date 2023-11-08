import { VNodeChild } from "vue";
import {
  DeepRequired,
  GenericObject,
  MaybePromise,
  NestedPaths,
} from "./utils";
import { DataSource, StaticFilter, TableFilter } from "./table";
import type { AutoPath } from "ts-toolbelt/out/Function/_api";
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

export type DataListSchema<
  Remote extends boolean = boolean,
  Source extends DataSource<GenericObject, Remote> = DataSource<
    GenericObject,
    Remote
  >,
  TData extends GenericObject = Source extends () => MaybePromise<
    Array<infer T extends GenericObject>
  >
    ? T
    : Source extends () => MaybePromise<{
        docs: Array<infer T extends GenericObject>;
      }>
    ? T
    : never,
  PathKeys = NestedPaths<TData>
> = {
  remote: Remote;
  datasource: Source;
  title: (params: { rowData: TData }) => VNodeChild;
  description?: () => VNodeChild;
  image?: () => VNodeChild;
  staticFilters?: StaticFilter[];
  rowActions?: DataListRowAction<TData>[];
  pagination?: boolean;
  sortOptions?: DataListSortOption<PathKeys>[];
  searchQuery?: PathKeys[];
  filters?: TableFilter[];
  defaultSort?: PathKeys | { key: PathKeys; dir: "asc" | "desc" };
  persistency?: false | "localStorage" | "sessionStorage";
  listKey?: string;
} & (
  | {
      persistency?: false;
    }
  | {
      persistency: "localStorage" | "sessionStorage";
      listKey: string;
    }
);

builListSchema({
  remote: false,
  title: ({ rowData }) => rowData.id,
  searchQuery: ["id", "name"],
  // s: "name",
  // title: ({ rowData }) => rowData.
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

function builListSchema<
  Remote extends boolean,
  Source extends DataSource<GenericObject, Remote>
>(schema: DataListSchema<Remote, Source>) {
  return schema;
}
