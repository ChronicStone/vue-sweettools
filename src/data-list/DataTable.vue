<script setup lang="ts">
import type { ColumnKey, SortOrder } from 'naive-ui/es/data-table/src/interface'
import type { HTMLAttributes } from 'vue'
import type { DataTableSchema, TDataTableColumn } from './types/datatable'
import { NDataTable, useThemeVars } from 'naive-ui'
import color from 'tinycolor2'

const props = withDefaults(defineProps<DataTableSchema<any, any, any>>(), {
  selection: true,
  pagination: true,
  compact: false,
  frameless: false,
  draggable: false,
})
const tableId = `TABLE_${Date.now()}`
const themeVars = useThemeVars()

const tableKeyRef = computed(() => props.tableKey ?? 'DEFAULT_LIST')
const columnsRef = computed(() => props.columns)
const filtersRef = computed(() => props.filters ?? [])
const staticFiltersRef = computed(() => props.staticFilters ?? [])
const quickFiltersRef = computed(() => props.quickFilters ?? [])
const searchQueryRef = computed(() => props.searchQuery ?? [])
const defaultSortRef = computed(() => props.defaultSort)
const remoteRef = computed(() => props.remote)
const actionsRef = computed(() => props.actions ?? [])
const selectionRef = computed(() => props.selection)
const persistencyRef = computed(() => props.persistency ?? false)
const rowActionsRef = computed(() => props.rowActions ?? [])
const expandableRef = computed(() => props.expandable)
const expandedContentRef = computed(() => props.expandedContent)
const draggableRef = computed(() => props.draggable)

const sortOptionsWithDefault = computed(() => props.sortOptions ?? [])
const maxHeightWithDefault = computed(() => props.maxHeight ?? '60vh')
const paginationWithDefault = computed(() => props.pagination)
const compactWithDefault = computed(() => props.compact)
const framelessWithDefault = computed(() => props.frameless)
const headerClassWithDefault = computed(() => props.headerClass)
const headerStyleWithDefault = computed(() => props.headerStyle)
const footerClassWithDefault = computed(() => props.footerClass)
const footerStyleWithDefault = computed(() => props.footerStyle)
const defaultPageSizeWithDefault = computed(() => props.defaultPageSize ?? 50)
const rowIdKeyWithDefault = computed(() => props.rowIdKey)

const tableWrapperRef = ref<HTMLElement>()
const tableRef = ref<InstanceType<typeof NDataTable>>()
const horizontalScrollbarHandleRef = ref<HTMLElement>()
const resizedColumnWidths = ref<Record<string, number>>({})

const tableInternalId = computed(
  () =>
    (tableRef.value?.$el as HTMLElement)
      ?.querySelector('thead')
      ?.getAttribute('data-n-id') ?? '',
)

const queryState = useQueryState({
  key: `${tableKeyRef.value}_LIST_STATE`,
  searchQuery: searchQueryRef.value,
  optimizeQuery: [],
  panelFilters: filtersRef,
  staticFilters: staticFiltersRef,
  quickFilters: quickFiltersRef,
  persistency: persistencyRef.value,
  defaultSort: defaultSortRef,
  defaultPageSize: defaultPageSizeWithDefault.value,
})

const resolver = useDataResolver({
  remote: remoteRef,
  datasource: props.datasource,
  fetchParams: queryState.fetchParams,
  pagination: queryState.paginationState,
  allSelected: queryState.selectAll,
  data: queryState.data,
  fullData: queryState.fullData,
  isLoading: queryState.isLoading,
  enablePagination: paginationWithDefault.value,
  rowKey: rowIdKeyWithDefault.value,
})

const dataApi = useDataApi({ queryState, resolver })
const mappedActions = useDataActions({
  actions: actionsRef,
  fetchParams: queryState.fetchParams,
  data: props.remote ? queryState.data : resolver.localDataStore,
  internalApi: dataApi,
  selectionState: queryState,
})

const columnsState = useTableColumns({
  columns: columnsRef,
  queryState,
  resolver,
  remote: remoteRef,
  dataApi,
  selection: selectionRef,
  persistency: persistencyRef,
  tableKey: tableKeyRef,
  searchQuery: searchQueryRef,
  rowActions: rowActionsRef,
  expandable: expandableRef,
  expandedContent: expandedContentRef,
  data: queryState.data,
  sortState: queryState.sortState,
  draggable: draggableRef,
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
  queryState,
  columns: columnsState.columnDefs,
  scrollX,
})

useTableDrag({
  draggable: draggableRef,
  onRowDrag: computed(() => props.onRowDrag),
  data: queryState.data,
  tableRef,
  columnsConfig: columnsState.columnConfig,
  columnsDef: columnsState.columnDefs,
  sortState: queryState.sortState,
  localStore: resolver.localDataStore,
  selection: selectionRef,
  hasRowActions: columnsState.hasActiveRowActions,
})

const themeColors = computed(() => ({
  rowSelected: color(themeVars.value.borderColor).darken(10).toString(),
  rowFocus: {
    backgroundColor: color(themeVars.value.primaryColor)
      .setAlpha(0.1)
      .toString(),
    borderColor: color(themeVars.value.primaryColor).setAlpha(0.5).toString(),
  },
}))

const tableThemeOverrides = {
  borderRadius: '0',
  resizableContainerSize: '16px',
  resizableSize: '3px',
}

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

function setInternalTableSort(
  sort: {
    key: string
    dir: 'asc' | 'desc'
  } | null,
) {
  if (!sort)
    tableRef.value?.clearSorter()
  else
    tableRef.value?.sort(sort.key, sort.dir === 'asc' ? 'ascend' : 'descend')
}

function handleSortUpdate(
  sort: { key: string, dir: 'asc' | 'desc' | null } | null,
) {
  const normalizedSort = sort?.dir ? { key: sort.key, dir: sort.dir } : null
  queryState.setSort(normalizedSort)
  setInternalTableSort(normalizedSort)
}

function updateCheckedRowKeys(
  keys: Array<string | number>,
  _: object[],
  meta: {
    row: object | undefined
    action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
  },
) {
  if (meta.action === 'checkAll' || meta.action === 'uncheckAll') {
    queryState.selectAll.value = meta.action === 'checkAll'
    queryState.selectedKeys.value
      = meta.action === 'checkAll'
        ? queryState.fullData.value.map(item => item.__$ROW_ID__)
        : []
  }
  else {
    queryState.selectedKeys.value = keys
  }
  if (meta.action === 'uncheck')
    queryState.selectAll.value = false

  if (
    meta.action === 'check'
    && queryState.selectedKeys.value.length === queryState.fullData.value.length
  ) {
    queryState.selectAll.value = true
  }
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
  const flatCols = getFlatColumns(props.columns)
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

const isSelected = (key: string) => queryState.selectedKeys.value.includes(key)

const tableScrollX = computed(() =>
  getLeafColumns(columnsState.columnDefs.value).reduce(
    (total, column) => total + getResolvedColumnWidth(column),
    0,
  ),
)

useProvideTableViewport({
  tableRef,
  tableWrapperRef,
  scrollX,
})

function getLeafColumns(columns: TDataTableColumn[]): TDataTableColumn[] {
  return columns.flatMap((column) => {
    if ('children' in column)
      return getLeafColumns(column.children)
    return [column]
  })
}

function getColumnKey(column: TDataTableColumn) {
  if ('type' in column)
    return `#internal__${column.type}`
  return String(column.key)
}

function getResolvedColumnWidth(column: TDataTableColumn) {
  return resizedColumnWidths.value[getColumnKey(column)] ?? getColumnWidth(column)
}

function getColumnWidth(column: TDataTableColumn) {
  if ('type' in column) {
    if (column.type === 'selection' || column.type === 'expand')
      return 40
  }

  if (!('width' in column))
    return 200

  if (typeof column.width === 'number')
    return column.width

  const parsedWidth = Number.parseFloat(column.width ?? '')
  return Number.isFinite(parsedWidth) ? parsedWidth : 200
}

function handleColumnResize(_: number, limitedWidth: number, column: TDataTableColumn & { key?: ColumnKey }) {
  resizedColumnWidths.value = {
    ...resizedColumnWidths.value,
    [String(column.key ?? getColumnKey(column))]: limitedWidth,
  }
  nextTick(updateScrollbarState)
}
</script>

<template>
  <CardContainer
    content="card"
    :frameless="framelessWithDefault"
    :compact="compactWithDefault"
  >
    <template #header>
      <ListHeader
        v-model:select-all="queryState.selectAll.value"
        v-model:search-query="queryState.filterState.value.searchQuery"
        v-model:panel-filters="queryState.filterState.value.panelFilters"
        v-model:columns-config="columnsState.columnConfig.value"
        :sort="queryState.sortState.value"
        :sort-options="sortOptionsWithDefault"
        :filters="filtersRef"
        :dropdown-actions="mappedActions"
        :nb-selected="queryState.nbSelected.value"
        :enable-search-query="searchQueryRef.length > 0"
        :resolve-grid-data="() => resolver.resolveGridData(true)"
        :reset-table-query="() => queryState.resetTableQuery()"
        :list-key="tableKeyRef"
        :compact="compactWithDefault"
        :reset-columns-config="columnsState.resetColumnsConfig"
        :enable-selection="selectionRef"
        :header-class="headerClassWithDefault"
        :header-style="headerStyleWithDefault"
        @update:sort="handleSortUpdate"
      >
        <slot />
      </ListHeader>
    </template>

    <QuickFilter
      v-if="quickFiltersRef.length"
      v-model:filter-state="queryState.filterState.value.quickFilters"
      :quick-filters="quickFiltersRef"
    />

    <div ref="tableWrapperRef">
      <NDataTable
        :id="tableId"
        ref="tableRef"
        :checked-row-keys="queryState.selectedKeys.value"
        :columns="columnsState.columnDefs.value"
        :loading="queryState.isLoading.value"
        :data="queryState.data.value"
        flex-height
        :scroll-x="tableScrollX"
        :style="{ height: maxHeightWithDefault }"
        :row-key="getRowKey"
        :size="compactWithDefault ? 'small' : 'large'"
        :theme-overrides="tableThemeOverrides"
        :on-update:sorter="handleSortChange"
        virtual-scroll
        :single-column="false"
        :single-line="false"
        :on-scroll="
          (e) => {
            updateScrollbarState();
            persistScrollPosition(e);
          }
        "
        :on-unstable-column-resize="handleColumnResize"
        :on-update:checked-row-keys="updateCheckedRowKeys"
        :row-props="
          (row, rowIndex) =>
            ({
              'data-row-index': rowIndex,
              'data-row-id': row.__$ROW_ID__,
              'class': isSelected(row.__$ROW_ID__)
                ? 'n-data-table-tr--selected'
                : '',
            }) as HTMLAttributes
        "
      />
    </div>

    <template #footer>
      <ListPagination
        v-if="paginationWithDefault"
        v-model:pagination-state="queryState.paginationState.value"
        :compact="compactWithDefault"
        :footer-class="footerClassWithDefault"
        :footer-style="footerStyleWithDefault"
      />
    </template>
  </CardContainer>

  <Teleport
    v-if="tableElementExists && teleportActive"
    :to="`#${tableId} .n-data-table-base-table-body`"
  >
    <div
      class="n-scrollbar-rail n-scrollbar-rail--horizontal"
      data-scrollbar-rail="true"
      aria-hidden="true"
      style="z-index: 3"
    >
      <Transition name="fade">
        <div
          v-if="(scrollbarVisible && xScrollable) || isDragScrolling"
          ref="horizontalScrollbarHandleRef"
          class="n-scrollbar-rail__scrollbar"
          :style="{
            width: `${scrollbarWidth}px`,
            left: `${scrollbarOffset}px`,
          }"
        />
      </Transition>
    </div>
  </Teleport>

  <Teleport
    v-if="tableElementExists && teleportActive && summaryRows.length"
    :to="`#${tableId} .n-data-table-wrapper`"
  >
    <div ref="summaryTableRef" class="!overflow-hidden hide-scrollbar">
      <table
        :style="{ tableLayout: 'fixed' }"
        class="border-collapse n-data-table-table"
      >
        <colgroup>
          <col
            v-for="(group, index) in columnGroupDef"
            :key="index"
            :style="group.style"
          >
        </colgroup>
        <thead :data-n-id="tableInternalId" class="!p-0 n-data-table-thead">
          <tr
            v-for="(row, index) in summaryRows"
            :key="index"
            :style="{
              borderCollapse: 'collapse',
              borderSpacing: 0,
              borderTop: `1px solid ${themeVars.borderColor} !important`,
            }"
            class="!p-0 n-data-table-tr"
          >
            <th
              v-for="(cell, key) in row"
              :key="key"
              :colspan="cell?.colSpan ?? 1"
              :rowspan="cell?.rowSpan ?? 1"
              class="n-data-table-th !border-(spacing-0 collapse) !p-3 box-border py-2 font-semibold"
              :class="{
                'n-data-table-th--fixed-left left-0': cell?.fixed === 'left',
                'n-data-table-th--fixed-right right-0': cell?.fixed === 'right',
              }"
              :style="
                cell.fixed === 'left'
                  ? { left: `${cell.fixedMeta.start}px` }
                  : cell.fixed === 'right'
                    ? { right: `${cell.fixedMeta.start}px` }
                    : {}
              "
              :data-col-key="cell.key"
            >
              <component :is="cell.value" />
            </th>
          </tr>
        </thead>
      </table>
    </div>
  </Teleport>
</template>

<style>
.n-data-table-th__ellipsis {
  width: 100% !important;
}

.n-data-table-resize-button {
  z-index: 4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Define the ending state (leave) */
.fade-enter-to,
.fade-leave-from {
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
  transition: box-shadow 0.2s var(--n-bezier);
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
  transition: box-shadow 0.2s var(--n-bezier);
  right: -36px;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
  overflow-x: auto;
}

.n-data-table-tr--selected > .n-data-table-td {
  background: v-bind("themeColors.rowSelected") !important;
}

.n-data-table-tr--expanded > .n-data-table-td {
  padding: 0 !important;
  position: relative;
}
</style>
