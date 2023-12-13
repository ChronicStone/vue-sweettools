<script setup lang="ts">
import { NButton, NTooltip } from 'naive-ui'
import type { DataApi } from '../types/shared'
import type { GenericObject } from '@/_shared/types/utils'

const { actions, api, rowData } = definePropsRefs<{
  actions: ReturnType<typeof useTableRowActions>['rowsActions']['value'][number]['actions']
  api: DataApi
  rowData: GenericObject
}>()
</script>

<template>
  <div class="flex gap-1 items-center h-fit">
    <template v-if="actions.length">
      <NTooltip
        v-for="({ icon, label, link, action }, key) in actions"
        :key="key"
      >
        <template #trigger>
          <component
            :is="link ? 'router-link' : 'div'"
            v-bind="{
              ...(link ? { to: link } : {}),
            }"
            v-on="{
              click: () =>
                action?.({
                  rowData,
                  tableApi: api,
                }),
            }"
          >
            <NButton size="tiny" quaternary>
              <template #icon>
                <span
                  class="iconify cursor-pointer  transition-all ease-in-out duration-150"
                  :data-icon="icon"
                />
              </template>
            </NButton>
          </component>
        </template>
        {{ label }}
      </NTooltip>
    </template>

    <template v-else>
      N/A
    </template>
  </div>
</template>
