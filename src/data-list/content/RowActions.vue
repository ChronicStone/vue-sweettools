<script setup lang="ts">
import { NButton, NTooltip } from 'naive-ui'
import type { DataApi, RowAction } from '../types/shared'
import type { GenericObject } from '@/_shared/types/utils'

const { actions, api, rowData } = definePropsRefs<{ actions: RowAction[]; api: DataApi; rowData: GenericObject }>()

const { permissionValidator } = useGlobalConfig()

const rowActions = computed(() =>
  actions.value
    .map(action => ({
      ...action,
      icon:
        typeof action.icon === 'function'
          ? action.icon({ rowData: rowData.value })
          : action.icon,
      label:
        typeof action.label === 'function'
          ? action.label({ rowData: rowData.value })
          : action.label,
      ...(action.link && {
        link:
          typeof action.link === 'function'
            ? action.link({ rowData: rowData.value })
            : action.link,
      }),
    }))
    .filter(
      action =>
        action?.condition?.({
          rowData: rowData.value,
          tableApi: api.value,
        }) ?? true,
    )
    .filter(action =>
      !action?.permissions?.length
        ? true
        : permissionValidator?.value?.(action.permissions) ?? true,
    ),
)
</script>

<template>
  <div class="flex gap-1 items-center h-fit">
    <template v-if="rowActions.length">
      <NTooltip
        v-for="({ icon, label, link, action }, key) in rowActions"
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
