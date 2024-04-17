import 'virtual:uno.css'
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import type { AppTypes, SweettoolsPluginConfig } from './_shared/types/lib'
import type { ActionParams, DynamicFilter, FetchParams, RemoteDataSource, StaticFilter } from './data-list/types/shared'
import type { FormRefInstance } from './form/types/instance'
import DataList from './data-list/DataList.vue'
import DataTable from './data-list/DataTable.vue'
import FormRenderer from './form/components/Renderer/FormRenderer.vue'
import FormProvider from './form/components/Provider/FormProvider.vue'
import DataGrid from './data-grid/DataGrid.vue'
import { booleanExistFilter, booleanFilter, propertyBuilderFilter, selectFilter, textFilter, timeRangeFilter } from './data-list/utils/filters'
import { buildFieldSchema, buildFormSchema, buildMultiFieldSchema, useFormController } from './form/composables/useFormController'
import { buildListSchema, buildTableSchema, defineFilterProperty } from './data-list/composables/useSchemaBuilder'
import { useFormApi } from './form/composables/useFormApi'
import { buildGridSchema } from './data-grid/schemaBuilder'
import { renderVNode } from './_shared/utils/render'
import { useLocalizedValidators } from './form/composables/useLocalizedValidators'
import ExcelReader from './excel-reader/components/ExcelReader.vue'
import { buildExcelSchema } from './excel-reader/utils/schema'
import { useExcelReader } from './excel-reader/composables/useExcelReader'
import { PLUGIN_CONF_INJECTION_KEY } from './_shared/config/injectionKeys'

export default {
  install: (app: App, config?: SweettoolsPluginConfig) => {
    const i18nInstance = (app as any).__VUE_I18N_SYMBOL__
    app.provide(PLUGIN_CONF_INJECTION_KEY, config)
    if (!i18nInstance) {
      const i18n = createI18n({ legacy: false, locale: 'en' })
      app.use(i18n)
    }
  },
}

export type {
  DynamicFilter,
  StaticFilter,
  FetchParams,
  FormRefInstance,
  AppTypes,
  RemoteDataSource,
  ActionParams,
  SweettoolsPluginConfig,
}

export {
  DataTable,
  DataList,
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
  buildMultiFieldSchema,
  buildListSchema,
  useFormApi,
  buildExcelSchema,
  useExcelReader,
  buildTableSchema,
  buildGridSchema,
  renderVNode,
  useLocalizedValidators,
  defineFilterProperty,
  propertyBuilderFilter,
}
