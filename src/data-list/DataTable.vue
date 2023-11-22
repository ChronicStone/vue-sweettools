<script setup lang="ts">
import { withDefaults } from 'unplugin-vue-macros/macros' assert { type: 'macro' }
import { NCard, NDataTable } from 'naive-ui'
import type { SortOrder } from 'naive-ui/es/data-table/src/interface'
import { DndProvider } from 'vue3-dnd'
import type { DataTableSchema } from './types/datatable'

const tableId = `TABLE_${Date.now()}`

const {
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

const dragDropBackend = useDndBackend()

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
  queryState.setSort(
    !value || !value?.order
      ? null
      : {
          key: parseColumnKey(value.columnKey),
          dir: value.order === 'ascend' ? 'asc' : 'desc',
        },
  )
}

const tableWrapperRef = ref<HTMLElement>()
const tableRef = ref<InstanceType<typeof NDataTable>>()
const horizontalScrollbarHandleRef = ref<HTMLElement>()

const xScrollable = ref(false)
const scrollbarVisible = ref(false)
const teleportActive = ref(false)
const scrollbarWidth = ref(0)
const scrollbarOffset = ref(0)
const isDragScrolling = ref(false)
const dragScrollStart = ref(0)

const { width } = useWindowSize()
const hover = useElementHover(tableWrapperRef)

const elementExists = useElementObserver(`#${tableId} .n-data-table-base-table-body`, tableWrapperRef)
watchDebounced(elementExists, (v) => {
  if (!v) {
    teleportActive.value = false
    return
  }
  teleportActive.value = true
  updateScrollbarState()
}, { debounce: 100 })

function getTableContentEl() {
  return (tableRef.value?.$el as HTMLElement).querySelector('.v-vl')
}

function updateScrollbarState() {
  if (isDragScrolling.value)
    return
  const referenceContainer = document.querySelector(`#${tableId} .v-vl-visible-items`)
  const target = getTableContentEl()
  if (!target || !referenceContainer)
    return
  const handleSize = (target.clientWidth / referenceContainer.scrollWidth) * target.clientWidth
  scrollbarWidth.value = handleSize
  scrollbarOffset.value = (target.scrollLeft / referenceContainer.scrollWidth) * target.clientWidth
  xScrollable.value = target.scrollWidth > target.clientWidth
}

watch(() => width.value, updateScrollbarState)
watch(hover, v => scrollbarVisible.value = v)

const { x } = useMouse()

useEventListener('mouseup', () => isDragScrolling.value = false)
useEventListener('mousedown', (e) => {
  if (e.target !== horizontalScrollbarHandleRef.value)
    return

  dragScrollStart.value = x.value
  isDragScrolling.value = true
})

watch(scrollbarOffset, (v) => {
  const containerWidth = getTableContentEl()?.clientWidth ?? 0
  const referenceContainer = document.querySelector(`#${tableId} .v-vl-visible-items`)
  if (!referenceContainer)
    return

  tableRef.value?.scrollTo({ left: (v / containerWidth) * referenceContainer.scrollWidth })
})

watch(() => x.value, (xMouse) => {
  if (!isDragScrolling.value)
    return
  const containerWidth = getTableContentEl()?.clientWidth ?? 0
  const direction = xMouse > dragScrollStart.value ? 'right' : 'left'
  const distance = Math.abs(xMouse - dragScrollStart.value)
  scrollbarOffset.value = direction === 'right'
    ? scrollbarOffset.value + distance > containerWidth - scrollbarWidth.value
      ? containerWidth - scrollbarWidth.value
      : scrollbarOffset.value + distance
    : scrollbarOffset.value - distance < 0
      ? 0
      : scrollbarOffset.value - distance
  dragScrollStart.value = xMouse
})

const scrollViewportLoaded = ref(false)
function persistScrollPosition(e: Event) {
  const target = e.target as HTMLElement
  const scrollTop = target.scrollTop
  queryState.topViewportOffset.value = scrollTop
}

watch(() => elementExists.value, (v) => {
  if (scrollViewportLoaded.value || !v)
    return
  scrollViewportLoaded.value = true
  tableRef.value?.scrollTo({ top: queryState.topViewportOffset.value })
})

watch(() => queryState.paginationState.value.pageIndex, () => tableRef.value?.scrollTo({ top: 0 }))

function setInternalTableSort(sort: {
  key: string
  dir: 'asc' | 'desc'
} | null) {
  if (!sort)
    tableRef.value?.clearSorter()
  else tableRef.value?.sort(sort.key, sort.dir === 'asc' ? 'ascend' : 'descend')
}

onMounted(() => {
  if (queryState.sortState.value.key) {
    setInternalTableSort({
      key: queryState.sortState.value.key,
      dir: queryState.sortState.value.dir ?? 'asc',
    })
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
          v-model:checked-row-keys="queryState.selectedKeys.value"
          :columns="columnsState.columnDefs.value"
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
          :on-scroll="(e) => {
            updateScrollbarState()
            persistScrollPosition(e)
          }"
          :on-unstable-column-resize="updateScrollbarState"
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

    <Teleport v-if="elementExists && teleportActive" :to="`#${tableId} .n-data-table-base-table-body`">
      <div class="n-scrollbar-rail n-scrollbar-rail--horizontal" data-scrollbar-rail="true" aria-hidden="true" style="z-index: 3;">
        <Transition name="fade">
          <div v-if="(scrollbarVisible && xScrollable) || isDragScrolling" ref="horizontalScrollbarHandleRef" class="n-scrollbar-rail__scrollbar" :style="{ width: `${scrollbarWidth}px`, left: `${scrollbarOffset}px` }" />
        </Transition>
        x
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
</style>
