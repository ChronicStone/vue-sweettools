import { App } from "vue";
import DataTable from "./components/DataTable/DataTable.vue";
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
import { useSweetform } from "./composables/useSweetform";

export default {
  install: (app: App, config: SweettoolsPluginConfig) => {
    app.provide(PLUGIN_CONF_INJECTION_KEY, config);
    app.component("DataTable", DataTable);
  },
};

export {
  DataTable,
  textFilter,
  selectFilter,
  booleanExistFilter,
  timeRangeFilter,
  booleanFilter,
  useSweetform,
};
