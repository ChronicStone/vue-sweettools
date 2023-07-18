import ExcelReader from "./components/ExcelReader/ExcelReader.vue";
import { App } from "vue";
import DataTable from "./components/DataTable/DataTable.vue";
import FormRenderer from "./components/Form/Renderer/FormRenderer.vue";
import FormProvider from "./components/Form/Provider/FormProvider.vue";
import DataGrid from "./components/DataGrid/DataGrid.vue";
import {
  booleanExistFilter,
  booleanFilter,
  textFilter,
  selectFilter,
  timeRangeFilter,
} from "./components/DataTable/filters";
import "virtual:windi.css";
import { PLUGIN_CONF_INJECTION_KEY } from "./config/injectionKeys";
import { AppTypes, SweettoolsPluginConfig } from "./types/lib";
import {
  useFormController,
  buildFormSchema,
  buildFieldSchema,
} from "./composables/form/useFormController";
import { useFormApi } from "./composables/form/useFormApi";
import {
  buildExcelSchema,
  useExcelReader,
} from "./composables/excel/useImportController";
import { buildTableSchema } from "./composables/buildTableSchema";
import { buildGridSchema } from "./composables/buildTableSchema";
import { FormRefInstance } from "./types/form/instance";
import { Column } from "ag-grid-community";
import { DataGridSchema } from "./types/datagrid";
import { FormField } from "./types/form/fields";
import {
  DataTableSchema,
  TableFilter,
  StaticFilter,
  TableAction,
  TableRowAction,
  TableActionParams,
  FetchParams,
  RemoteTableData,
} from "./types/table";
import { renderVNode } from "./utils/renderVNode";
export default {
  install: (app: App, config?: SweettoolsPluginConfig) => {
    app.provide(PLUGIN_CONF_INJECTION_KEY, config);
    // app.component("DataTable", DataTable);
  },
};

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
  AppTypes,
};

export {
  DataTable,
  FormRenderer,
  FormProvider,
  DataGrid,
  ExcelReader,
  textFilter,
  selectFilter,
  booleanExistFilter,
  timeRangeFilter,
  booleanFilter,
  useFormController,
  buildFormSchema,
  buildFieldSchema,
  useFormApi,
  buildExcelSchema,
  useExcelReader,
  buildTableSchema,
  buildGridSchema,
  renderVNode,
};
