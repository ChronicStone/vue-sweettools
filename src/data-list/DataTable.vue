<script setup lang="ts">
import { withDefaults } from 'unplugin-vue-macros/macros' assert { type: 'macro' }
import { NCard, NDataTable } from 'naive-ui'
import type { SortOrder } from 'naive-ui/es/data-table/src/interface'
import type { DataTableSchema } from './types/datatable'

const {
  tableKey,
  columns,
  // expandedContent,
  remote,
  datasource,
  // rowActions,
  persistency,
  filters,
  staticFilters,
  searchQuery,
  defaultSort,
  defaultPageSize,
  sortOptions,
  // maxHeight,
  actions,
  selection,
  rowIdKey,
  pagination,
  compact,
  rowActions,
} = withDefaults(definePropsRefs<DataTableSchema>(), {
  tableKey: () => 'DEFAULT_LIST',
  filters: () => [],
  searchQuery: () => [],
  staticFilters: () => [],
  sortOptions: () => [],
  maxHeight: 1200,
  actions: () => [],
  pagination: true,
  selection: true,
  persistency: false,
  rowActions: () => [],
  defaultPageSize: 50,
  compact: false,
})

onBeforeMount(() => {
  const flatCols = getFlatColumns(columns.value)
  // GET COLUMN KEYS THAT ARE DUPLICATED
  const duplicateKeys = flatCols
    .map(col => col.key)
    .filter((key, index, self) => self.indexOf(key) !== index)
  if (duplicateKeys.length > 0) {
    console.warn(
      `Duplicate column keys found: ${duplicateKeys.join(
        ', ',
      )}. Please make sure that all column keys are unique.`,
    )
  }
})

const queryState = useQueryState({
  key: `${tableKey.value ?? 'DEFAULT_LIST'}_LIST_STATE`,
  searchQuery: searchQuery.value,
  optimizeQuery: [],
  panelFilters: filters,
  staticFilters,
  persistency: persistency.value,
  defaultSort,
  defaultPageSize: defaultPageSize.value,
})

const resolver = useDataResolver({
  remote,
  datasource: datasource.value,
  fetchParams: queryState.fetchParams,
  pagination: queryState.paginationState,
  allSelected: queryState.selectAll,
  data: queryState.data,
  isLoading: queryState.isLoading,
  enablePagination: pagination.value,
  rowKey: rowIdKey.value,
})

const dataApi = useDataApi({ queryState, resolver })
const mappedActions = useDataActions({
  actions,
  fetchParams: queryState.fetchParams,
  data: remote.value ? queryState.data : resolver.localDataStore,
  internalApi: dataApi,
  selectionState: queryState,
})

const { columnDefs, columnConfig } = useTableColumns({
  columns,
  queryState,
  resolver,
  remote,
  dataApi,
  selection,
  persistency,
  tableKey,
  searchQuery,
  rowActions,
})

function parseColumnKey(key: string) {
  const output = key.split('__$COL_ID__').reverse()[0]
  if (!output)
    throw new Error(`Invalid column key: ${key}`)
  return output
}

function getRowKey(row: (typeof queryState)['data']['value'][number]) {
  return row.__$ROW_ID__
}

function handleSortChange(
  value: { columnKey: string; order: SortOrder } | null,
) {
  console.log('sort', value)
  queryState.setSort(
    !value || !value?.order
      ? null
      : {
          key: parseColumnKey(value.columnKey),
          dir: value.order === 'ascend' ? 'asc' : 'desc',
        },
  )
}
</script>

<template>
  <NCard
    content-style="padding: 0;"
    :header-style="{ ...(compact ? { padding: '1em' } : {}) }"
    :actions-style="{ ...(compact ? { padding: '0em' } : {}) }"
  >
    <template #header>
      <ListHeader
        v-model:select-all="queryState.selectAll.value"
        v-model:search-query="queryState.filterState.value.searchQuery"
        v-model:panel-filters="queryState.filterState.value.panelFilters"
        v-model:columns-config="columnConfig"
        :sort="queryState.sortState.value"
        :sort-options="sortOptions"
        :filters="filters"
        :dropdown-actions="mappedActions"
        :nb-selected="queryState.nbSelected.value"
        :enable-search-query="searchQuery.length > 0"
        :resolve-grid-data="() => resolver.resolveGridData(true)"
        :reset-table-query="() => queryState.resetTableQuery()"
        :list-key="tableKey"
        :compact="compact"
        @update:sort="queryState.setSort"
      >
        <slot />
      </ListHeader>
    </template>

    <NDataTable
      v-model:checked-row-keys="queryState.selectedKeys.value"
      :columns="columnDefs"
      :loading="queryState.isLoading.value"
      :data="queryState.data.value"
      flex-height
      class="h-[60vh]"
      :row-key="getRowKey"
      :size="compact ? 'small' : 'large'"
      :theme-overrides="{ borderRadius: '0' }"
      :on-update:sorter="handleSortChange"
      virtual-scroll
      :single-column="false"
      :single-line="true"
      :scrollbar-props="{ trigger: 'none' }"
    />

    <template #action>
      <ListPagination
        v-if="pagination"
        v-model:pagination-state="queryState.paginationState.value"
        :compact="compact"
      />
    </template>
  </NCard>
</template>

<style>
.n-data-table-th__ellipsis {
  width: 100% !important;
}
</style>
