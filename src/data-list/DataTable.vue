<script setup lang="ts">
import { table } from 'node:console'
import { withDefaults } from 'unplugin-vue-macros/macros' assert { type: 'macro' }
import { NCard, NDataTable, useThemeVars } from 'naive-ui'
import type { SortOrder } from 'naive-ui/es/data-table/src/interface'
import { DndProvider } from 'vue3-dnd'
import type { DataTableSchema } from './types/datatable'

const tableId = `TABLE_${Date.now()}`
const themeVars = useThemeVars()

const {
  maxHeight,
  tableKey,
  columns,
  expandedContent,
  expandable,
  remote,
  datasource,
  persistency,
  filters,
  staticFilters,
  searchQuery,
  defaultSort,
  defaultPageSize,
  sortOptions,
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
  maxHeight: '60vh',
  actions: () => [],
  pagination: true,
  selection: true,
  persistency: false,
  rowActions: () => [],
  defaultPageSize: 50,
  compact: false,
})

const dragDropBackend = useDndBackend()
const tableWrapperRef = ref<HTMLElement>()
const tableRef = ref<InstanceType<typeof NDataTable>>()
const horizontalScrollbarHandleRef = ref<HTMLElement>()

const tableInternalId = computed(() => (tableRef.value?.$el as HTMLElement)?.querySelector('thead')?.getAttribute('data-n-id') ?? '')

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
  fullData: queryState.fullData,
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

const columnsState = useTableColumns({
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
  expandable,
  expandedContent,
})

const {
  tableElementExists,
  scrollX,
  scrollbarVisible,
  teleportActive,
  xScrollable,
  isDragScrolling,
  scrollbarWidth,
  scrollbarOffset,
  persistScrollPosition,
  updateScrollbarState,
} = useTableScroll({
  tableId,
  tableWrapperRef,
  tableRef,
  horizontalScrollbarHandleRef,
  topViewportOffset: queryState.topViewportOffset,
  paginationState: queryState.paginationState,
})

const { summaryTableRef, columnGroupDef, summaryRows } = useTableSummary({
  tableId,
  data: queryState.data,
  columns: columnsState.columnDefs,
  scrollX,
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
  value: { columnKey: string, order: SortOrder } | null,
) {
  queryState.setSort(
    !value || !value?.order
      ? null
      : {
          key: parseColumnKey(value.columnKey),
          dir: value.order === 'ascend' ? 'asc' : 'desc',
        },
  )
}

function setInternalTableSort(sort: {
  key: string
  dir: 'asc' | 'desc'
} | null) {
  if (!sort)
    tableRef.value?.clearSorter()
  else tableRef.value?.sort(sort.key, sort.dir === 'asc' ? 'ascend' : 'descend')
}

function updateCheckedRowKeys(
  keys: Array<string | number>,
  _: object[],
  meta: { row: object | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' },
) {
  if (meta.action === 'checkAll' || meta.action === 'uncheckAll') {
    queryState.selectAll.value = meta.action === 'checkAll'
    queryState.selectedKeys.value = meta.action === 'checkAll' ? queryState.fullData.value.map(item => item.__$ROW_ID__) : []
  }

  else { queryState.selectedKeys.value = keys }
  if (meta.action === 'uncheck')
    queryState.selectAll.value = false

  if (meta.action === 'check' && queryState.selectedKeys.value.length === queryState.fullData.value.length)
    queryState.selectAll.value = true
}

onMounted(() => {
  if (queryState.sortState.value.key) {
    setInternalTableSort({
      key: queryState.sortState.value.key,
      dir: queryState.sortState.value.dir ?? 'asc',
    })
  }
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
</script>

<template>
  <DndProvider :backend="dragDropBackend">
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
          v-model:columns-config="columnsState.columnConfig.value"
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
          :reset-columns-config="columnsState.resetColumnsConfig"
          @update:sort="(e) => {
            queryState.setSort(e)
            setInternalTableSort(e)
          }"
        >
          <slot />
        </ListHeader>
      </template>

      <div ref="tableWrapperRef">
        <NDataTable
          :id="tableId"
          ref="tableRef"
          :checked-row-keys="queryState.selectedKeys.value"
          :columns="columnsState.columnDefs.value"
          :loading="queryState.isLoading.value"
          :data="queryState.data.value"
          flex-height
          :style="{ height: maxHeight }"
          :row-key="getRowKey"
          :size="compact ? 'small' : 'large'"
          :theme-overrides="{ borderRadius: '0' }"
          :on-update:sorter="handleSortChange"
          virtual-scroll
          :single-column="false"
          :single-line="false"
          :on-scroll="(e) => {
            updateScrollbarState()
            persistScrollPosition(e)
          }"
          :on-unstable-column-resize="updateScrollbarState"
          :on-update:checked-row-keys="updateCheckedRowKeys"
        />
      </div>

      <template #action>
        <ListPagination
          v-if="pagination"
          v-model:pagination-state="queryState.paginationState.value"
          :compact="compact"
        />
      </template>
    </NCard>

    <Teleport v-if="tableElementExists && teleportActive" :to="`#${tableId} .n-data-table-base-table-body`">
      <div class="n-scrollbar-rail n-scrollbar-rail--horizontal" data-scrollbar-rail="true" aria-hidden="true" style="z-index: 3;">
        <Transition name="fade">
          <div v-if="(scrollbarVisible && xScrollable) || isDragScrolling" ref="horizontalScrollbarHandleRef" class="n-scrollbar-rail__scrollbar" :style="{ width: `${scrollbarWidth}px`, left: `${scrollbarOffset}px` }" />
        </Transition>
      </div>
    </Teleport>

    <Teleport v-if="tableElementExists && teleportActive" :to="`#${tableId} .n-data-table-wrapper`">
      <div ref="summaryTableRef" class="overflow-hidden hide-scrollbar">
        <table :style="{ tableLayout: 'fixed' }" class="border-collapse n-data-table-table">
          <colgroup>
            <col v-for="(group, index) in columnGroupDef" :key="index" :style="group.style">
          </colgroup>
          <thead :data-n-id="tableInternalId" class="!p-0 n-data-table-thead">
            <tr
              v-for="(row, index) in summaryRows"
              :key="index"
              :style="{ borderCollapse: 'collapse', borderSpacing: 0, borderTop: `1px solid ${themeVars.borderColor} !important` }"
              class="!p-0 n-data-table-tr"
            >
              <th
                v-for="(cell, key) in row"
                :key="key"
                :colspan="cell?.colSpan ?? 1"
                :rowspan="cell?.rowSpan ?? 1"
                class="n-data-table-th !border-(spacing-0 collapse) !p-3 box-border text-[12px] py-2 font-semibold"
                :class="{
                  'n-data-table-th--fixed-left left-0': cell?.fixed === 'left',
                  'n-data-table-th--fixed-right right-0': cell?.fixed === 'right',
                }"
                :style="cell.fixed === 'left' ? { left: `${cell.fixedMeta.start}px` } : cell.fixed === 'right' ? { right: `${cell.fixedMeta.start}px` } : {}"
                :data-col-key="cell.key"
              >
                <component :is="() => renderVNode(cell.value)" />
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </Teleport>
  </DndProvider>
</template>

<style>
.n-data-table-th__ellipsis {
  width: 100% !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Define the ending state (leave) */
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

.fixed-left {
  left: 0;
  position: sticky;
  z-index: 2;
}

.fixed-left::after {
  pointer-events: none;
  content: "";
  width: 36px;
  display: inline-block;
  position: absolute;
  top: 0;
  bottom: -1px;
  transition: box-shadow .2s var(--n-bezier);
  right: -36px;
}

.fixed-right {
  right: 0;
  position: sticky;
  z-index: 2;
}

.fixed-right::before {
  pointer-events: none;
  content: "";
  width: 36px;
  display: inline-block;
  position: absolute;
  top: 0;
  bottom: -1px;
  transition: box-shadow .2s var(--n-bezier);
  right: -36px;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    overflow-x: auto;
}
</style>
