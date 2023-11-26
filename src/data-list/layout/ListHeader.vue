<script setup lang="tsx">
import {
  NBadge,
  NButton,
  NCheckbox,
  NDivider,
  NDropdown,
  NIcon,
  NPopover,
  NTooltip,
} from 'naive-ui'
import type { useDataActions } from '../composables/useDataActions'
import type { RuntimeColsConfig } from '../composables/useTableColums'
import type { DataSortOption, DynamicFilter } from '../types/shared'
import FilterPanel from './FilterPanel.vue'
import type { GenericObject } from '@/_shared/types/utils'
import type { FormRefInstance } from '@/form/types/instance'

const props = defineProps<{
  listKey: string
  nbSelected: number
  enableSearchQuery: boolean
  dropdownActions: ReturnType<typeof useDataActions>['value']
  filters: DynamicFilter[]
  sortOptions: DataSortOption<string>[]
  sort: { key: string; dir: 'asc' | 'desc' | null } | null
  resolveGridData: () => any
  resetTableQuery: () => any
  showSelectAll?: boolean
  compact: boolean
  resetColumnsConfig?: () => void
  selectedKeys?: (string | number)[]
}>()

defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:panelFilters', value: GenericObject): void
  (e: 'update:sort', value: null | { key: string; dir: 'asc' | 'desc' }): void
}>()

const { searchQuery, panelFilters, sort, selectAll, columnsConfig }
  = defineModels<{
    selectAll: boolean
    searchQuery: string
    panelFilters: GenericObject
    columnsConfig?: RuntimeColsConfig
    sort: { key: string; dir: 'asc' | 'desc' } | null
  }>()

const i18n = useTranslations()
const controlsWrapperRef = ref<HTMLElement>()
const panelFilterRef = ref<InstanceType<typeof FilterPanel>>()

const activeControls = computed(
  () =>
    Object.values({
      filters: props.filters.length > 0,
      sort: props.sortOptions.length > 0,
      refresh: true,
      columns: !!columnsConfig.value,
    }).filter(Boolean).length,
)

function resetAndReloadTable() {
  props.resetTableQuery()
  nextTick(() => props.resolveGridData())
}

const sortFormSchema = buildFormSchema({
  gridSize: 8,
  fieldSize: 8,
  fields: [
    {
      label: 'Field',
      key: 'key',
      type: 'radio',
      gridSize: 2,
      options: () =>
        props.sortOptions.map(o => ({ label: o.label, value: o.key })),
    },
    {
      label: 'Direction',
      key: 'dir',
      type: 'radio',
      default: 'asc',
      options: () => [
        {
          label: () => <span class="iconify" data-icon="mdi:sort-ascending" />,
          value: 'asc' as const,
        },
        {
          label: () => <span class="iconify" data-icon="mdi:sort-descending" />,
          value: 'desc' as const,
        },
      ],
    },
  ],
})

const formRef = ref<FormRefInstance>()
const { formData, reset } = useFormController(formRef, sortFormSchema)

async function emitSort() {
  await nextTick()
  sort.value = formData.value.key ? formData.value : null
}

const showColsConfig = ref<boolean>(false)
</script>

<template>
  <ColumnPanel
    v-if="columnsConfig"
    v-model:columns-config="columnsConfig"
    v-model:show="showColsConfig"
    :reset-columns-config="resetColumnsConfig!"
  />
  <div
    class="flex flex-col !lg:flex-row !lg:items-center !lg:justify-between w-full gap-4"
  >
    <div class="flex flex-col gap-2">
      <div><slot /></div>
      <span
        class="text-sm text-gray-500 font-light dark:text-gray-400 flex items-center gap-1"
      >
        <template v-if="showSelectAll">
          <NCheckbox v-model:checked="selectAll" :indeterminate="!selectAll && !!selectedKeys?.length" size="small" />
          <NDivider vertical />
        </template>
        {{ i18n.t("datatable.selectedRows", { count: props.nbSelected }) }}
      </span>
    </div>
    <div class="flex flex-col gap-3 !md:flex-row !md:items-center !md:gap-2">
      <SearchQueryInput
        v-if="enableSearchQuery"
        v-model:search-query="searchQuery"
        :size="compact ? 'small' : undefined"
        focus-sync
      />

      <NDropdown
        v-if="dropdownActions?.length"
        :options="dropdownActions"
        trigger="hover"
      >
        <NButton :size="compact ? 'small' : 'medium'" icon-placement="right">
          <template #icon>
            <mdi:dots-horizontal />
          </template>
        </NButton>
      </NDropdown>

      <div
        ref="controlsWrapperRef"
        class="grid md:flex gap-3 md:gap-2"
        :style="{
          gridTemplateColumns: `repeat(${activeControls}, minmax(0, 1fr))`,
        }"
      >
        <NPopover
          v-if="sortOptions?.length"
          placement="bottom"
          display-directive="show"
          trigger="click"
          style="max-width: 270px"
        >
          <template #trigger>
            <NBadge dot :show="!!sort?.key">
              <NButton
                :size="compact ? 'small' : 'medium'"
                class="!w-full !md:w-auto"
              >
                <template #icon>
                  <mdi:sort v-if="!sort?.key" />
                  <mdi:sort-ascending v-else-if="sort?.dir === 'asc'" />
                  <mdi:sort-descending v-else />
                </template>
              </NButton>
            </NBadge>
          </template>
          <FormRenderer
            ref="formRef"
            :data="sort || {}"
            :schema="sortFormSchema"
          />
          <template #footer>
            <div class="flex justify-end gap-2">
              <NButton
                size="tiny"
                @click="
                  () => {
                    reset(true);
                    emitSort();
                  }
                "
              >
                {{ i18n.t("datatable.clearSort") }}
              </NButton>
              <NButton type="primary" size="tiny" @click="emitSort">
                {{ i18n.t("datatable.saveSort") }}
              </NButton>
            </div>
          </template>
        </NPopover>

        <FilterPanel
          v-if="filters?.length"
          ref="panelFilterRef"
          v-model:filters="panelFilters"
          :filters-schema="filters"
        >
          <template #default="{ active }">
            <NBadge :value="active" class="w-full md:w-auto">
              <NButton
                :size="compact ? 'small' : 'medium'"
                class="!w-full !md:w-auto"
              >
                <template #icon>
                  <NIcon><mdi-filter /> </NIcon>
                </template>
              </NButton>
            </NBadge>
          </template>
        </FilterPanel>

        <NTooltip>
          <template #trigger>
            <ContextMenu
              :actions="[
                {
                  label: i18n.t('datatable.refreshAndResetAction'),
                  icon: 'material-symbols:filter-alt-off-outline',
                  action: resetAndReloadTable,
                },
              ]"
            >
              <NButton
                :size="compact ? 'small' : 'medium'"
                class="!w-full !md:w-auto"
                @click="resolveGridData"
              >
                <template #icon>
                  <NIcon>
                    <mdi-refresh />
                  </NIcon>
                </template>
              </NButton>
            </ContextMenu>
          </template>
          {{ i18n.t("datatable.refreshButtonTooltip") }}
        </NTooltip>

        <NTooltip v-if="columnsConfig">
          <template #trigger>
            <NButton
              :size="compact ? 'small' : 'medium'"
              class="!w-full !md:w-auto"
              @click="showColsConfig = true"
            >
              <template #icon>
                <material-symbols:settings />
              </template>
            </NButton>
          </template>
          {{ i18n.t("datatable.columnsConfigButtonTooltip") }}
        </NTooltip>
      </div>
    </div>
  </div>
</template>
