import type { SweettoolsPluginConfig } from "./types/lib";
import type {
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
import type { App, DefineComponent } from "vue";
import type { FormApi } from "./types/form/instance";

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

  export function useSweetform(): FormApi;

  const plugin: {
    install(app: App, config: SweettoolsPluginConfig): void;
  };

  export default plugin;
}
