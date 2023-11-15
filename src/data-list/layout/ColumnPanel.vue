<script setup lang="ts">
import {
  NDrawer,
  NDrawerContent,
  NIcon,
} from 'naive-ui'
import type { RuntimeColsConfig } from '../composables/useTableColums'

const i18n = useTranslations()
const { width } = useWindowSize()
const { columnsConfig, show } = defineModels<{
  columnsConfig: RuntimeColsConfig
  show: boolean
}>()
</script>

<template>
  <NDrawer
    v-model:show="show"
    display-directive="show"
    :width="width < 450 ? width : 450"
  >
    <NDrawerContent
      :native-scrollbar="false"
      :footer-style="{ justifyContent: 'flex-start' }"
      :body-content-style="{ padding: '0px' }"
      closable
    >
      <template #header>
        <div class="flex items-center justify-start py-2">
          <NIcon class="mr-2">
            <mdi:filter-variant />
          </NIcon>
          <span>
            {{ i18n.t("datatable.columnsConfigPanelTitle") }}
          </span>
        </div>
      </template>

      <ColumnConfig v-model:columns="columnsConfig" />
    </NDrawerContent>
  </NDrawer>
</template>
