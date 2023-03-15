import { App } from "vue";
import DataTable from "./components/DataTable/DataTable.vue";
import FormRenderer from "./components/Form/Renderer/FormRenderer.vue";
import {
  booleanExistFilter,
  booleanFilter,
  textFilter,
  selectFilter,
  timeRangeFilter,
} from "./components/DataTable/filters";
import "virtual:windi.css";
import { PLUGIN_CONF_INJECTION_KEY } from "./config/injectionKeys";
import { SweettoolsPluginConfig } from "./types/lib";
import {
  useFormController,
  buildFormSchema,
} from "./composables/form/useFormController";
import { useFormApi } from "./composables/form/useFormApi";

export default {
  install: (app: App, config: SweettoolsPluginConfig) => {
    app.provide(PLUGIN_CONF_INJECTION_KEY, config);
    // app.component("DataTable", DataTable);
  },
};

export {
  DataTable,
  FormRenderer,
  textFilter,
  selectFilter,
  booleanExistFilter,
  timeRangeFilter,
  booleanFilter,
  useFormController,
  buildFormSchema,
  useFormApi,
};
