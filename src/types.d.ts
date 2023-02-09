import {
  DataTableProps,
  TableActionParams,
  TableRowAction,
  FetchParams,
} from "@/types/table";
import { TableAction } from "@/types/table";
import { Column } from "@/types/table";
import type { DataTableSchema, StaticFilter, TableFilter } from "./types/table";
import { DefineComponent } from "vue";

declare module "@chronicstone/vue-sweettools" {
  export type {
    DataTableSchema,
    TableFilter,
    StaticFilter,
    Column,
    TableAction,
    TableRowAction,
    TableActionParams,
    FetchParams,
  };

  export const DataTable: DefineComponent<
    DataTableProps,
    unknown,
    Record<string, unknown>
  >;
}
