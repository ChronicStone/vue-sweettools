import { SweettoolsPluginConfig } from "./types/lib";
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
  RemoteTableData,
} from "./types/table";
import { App, DefineComponent } from "vue";

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
    RemoteTableData,
  };

  export const DataTable: DefineComponent<
    DataTableProps,
    unknown,
    Record<string, unknown>
  >;

  const plugin: {
    install(app: App, config: SweettoolsPluginConfig): void;
  };

  export default plugin;
}
