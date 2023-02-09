import {
  DataTableProps,
  TableActionParams,
  TableRowAction,
  FetchParams,
  TableAction,
  Column,
  DataTableSchema,
  StaticFilter,
  TableFilter,
} from "@/types/table";
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
