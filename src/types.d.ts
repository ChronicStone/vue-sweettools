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
import type { FormSchema } from "./types/form/form";
import type { FormField } from "./types/form/fields";
import type { FormRefInstance } from "./types/form/instance";
import {
  booleanExistFilter,
  booleanFilter,
  textFilter,
  selectFilter,
  timeRangeFilter,
} from "./components/DataTable/filters";
import {
  useFormController,
  buildFormSchema,
} from "./composables/form/useFormController";
import { useFormApi } from "./composables/form/useFormApi";

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
    FormSchema,
    FormField,
    FormRefInstance,
  };

  export const DataTable: DefineComponent<
    DataTableProps,
    unknown,
    Record<string, unknown>
  >;

  export const FormRenderer: DefineComponent<{
    schema: FormSchema;
    data?: Record<string, unknown>;
  }>;

  export const FormProvider: DefineComponent<{}>;

  export {
    booleanExistFilter,
    booleanFilter,
    textFilter,
    selectFilter,
    timeRangeFilter,
    useFormController,
    useFormApi,
    buildFormSchema,
  };

  const plugin: {
    install(app: App, config: SweettoolsPluginConfig): void;
  };

  export default plugin;
}
