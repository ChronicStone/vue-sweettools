import { DataGridProps, DataGridSchema } from "./types/datagrid";
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
  buildFieldSchema,
} from "./composables/form/useFormController";
import { useFormApi } from "./composables/form/useFormApi";
import { buildTableSchema } from "./composables/buildTableSchema";
import {
  buildExcelSchema,
  useExcelReader,
} from "./composables/excel/useImportController";
import TExcelReader from "./components/ExcelReader/ExcelReader.vue";

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
    FormField,
    FormRefInstance,
    DataGridSchema,
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

  // eslint-disable-next-line @typescript-eslint/ban-types
  export const FormProvider: DefineComponent<{}>;

  export const DataGrid: DefineComponent<
    DataGridProps,
    unknown,
    Record<string, unknown>
  >;

  export const ExcelReader: typeof TExcelReader;

  export {
    booleanExistFilter,
    booleanFilter,
    textFilter,
    selectFilter,
    timeRangeFilter,
    useFormController,
    useFormApi,
    buildFormSchema,
    buildFieldSchema,
    buildExcelSchema,
    useExcelReader,
    buildTableSchema,
  };

  const plugin: {
    install(app: App, config: SweettoolsPluginConfig): void;
  };

  export default plugin;
}
