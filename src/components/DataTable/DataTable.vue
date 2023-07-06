<script setup lang="ts">
import TableHeader from "./TableHeader.vue";
import TableFooter from "./TableFooter.vue";
import { useDataResolver } from "@/composables/useDataResolver";
import { useDropdownActions } from "@/composables/useDropdownActions";
import { useGridColumns } from "@/composables/useGridColumns";
import { useGridStyle } from "@/composables/useGridStyle";
import { useQueryState } from "@/composables/useQueryState";
import { DataTableProps, TableApi } from "@/types/table";
import {
  BodyScrollEvent,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowDragEvent,
  SelectionChangedEvent,
  SortChangedEvent,
} from "ag-grid-community";
import { NSpin, NCard, GlobalThemeOverrides } from "naive-ui";
import { AgGridVue } from "ag-grid-vue3";
import { computed, ref, watch } from "vue";
import { ComputedRef } from "vue";
import { BuiltInGlobalTheme } from "naive-ui/es/themes/interface";

const props = withDefaults(defineProps<DataTableProps>(), {
  tableKey: () => Date.now().toString(),
  optimizeQuery: () => [],
  enableSelection: true,
  searchQuery: () => [],
  filters: () => [],
  staticFilters: () => [],
  persistFilters: true,
  borderless: false,
  rowActions: () => [],
  actions: () => [],
  persistency: "sessionStorage",
  draggable: false,
});

const parentConfigScope = inject<{
  mergedThemeOverridesRef: ComputedRef<GlobalThemeOverrides>;
  mergedThemeRef: ComputedRef<BuiltInGlobalTheme | null>;
}>("n-config-provider");

const _isDark = computed(
  () => parentConfigScope?.mergedThemeRef.value?.name === "dark"
);
const _themeOverrides = computed(
  () => parentConfigScope?.mergedThemeOverridesRef.value ?? {}
);
const { borderColor, themeVars, selectedCellColor, hoverCellColor, theme } =
  useGridStyle(_isDark);

const _enableSelection = computed(() => props.enableSelection);
const _columns = computed(() => props.columns);
const _rowActions = computed(() => props.rowActions);
const _actions = computed(() => props.actions);
const _remote = computed(() => props.remote);
const _panelFilters = computed(() => props.filters);
const _staticFilters = computed(() => props.staticFilters);
const _draggable = computed(() => props.draggable);
const _defaultSort = computed(() => props.sort);

const gridApi = ref<GridApi>();
const columnApi = ref<ColumnApi>();
const tableApi = ref<TableApi>();
const isGridMounted = ref<boolean>(false);
const gridOptions = ref<GridOptions>();

const {
  data,
  isLoading,
  selectAll,
  selected,
  nbSelected,
  sortState,
  filterState,
  fetchParams,
  paginationState,
  topViewportOffset,
  initializeFilterState,
} = useQueryState(
  props.tableKey,
  props.searchQuery,
  props.optimizeQuery,
  _panelFilters,
  _staticFilters,
  props.persistency,
  _defaultSort
);

const { resolveGridData, localDataStore } = useDataResolver(
  _remote,
  isLoading,
  data,
  props.datasource,
  paginationState,
  fetchParams,
  gridApi,
  selectAll
);

const mappedActions = useDropdownActions(
  _actions,
  tableApi,
  fetchParams,
  !props.remote ? localDataStore : data,
  {
    selectAll,
    selected,
    nbSelected,
  }
);

const { columnDefs, defaultColumnDef } = useGridColumns(
  {
    isRemote: _remote,
    columns: _columns,
    enableSelection: _enableSelection,
    rowActions: _rowActions,
    setGlobalSelection,
    selectAll,
    selected,
    nbSelected,
    fetchParams,
  },
  tableApi,
  theme,
  _themeOverrides,
  _draggable
);

tableApi.value = {
  refreshData: () => resolveGridData(true),
  setSearchQuery: (value: string) => (filterState.value.searchQuery = value),
  resetFilters: () => initializeFilterState(true),
  setSort: (key: string, dir: "asc" | "desc" | null = null) => (
    (sortState.value.key = key), (sortState.value.dir = dir)
  ),
  setPage: (page: number) => (paginationState.value.pageIndex = page),
  setPageSize: (size: number) => (paginationState.value.pageSize = size),
  updateRow: (rowSelector, rowUpdater) => {
    const rowIndex = data.value.findIndex(rowSelector);
    if (rowIndex === -1) return false;

    data.value[rowIndex] = rowUpdater(data.value[rowIndex]);
    return true;
  },
  updateRows: (rowsSelector, rowsUpdater) => {
    const rowIndexes = data.value.reduce(
      (acc, curr, index) =>
        rowsSelector(curr) ? [...(acc as number[]), index] : acc,
      []
    ) as number[];

    for (const index of rowIndexes) {
      data.value[index] = rowsUpdater(data.value[index]);
    }

    return rowIndexes.length ? true : false;
  },
};

function setGlobalSelection(value: boolean) {
  selectAll.value = value;
}

function handleGridSort({ columnApi }: SortChangedEvent) {
  const sortedCol = columnApi
    ?.getColumns()
    ?.find((column) => column.isSorting());

  if (sortedCol) {
    sortState.value.colId = sortedCol.getColId();
    sortState.value.key = sortedCol.getColDef().field as string;
    sortState.value.dir = sortedCol.getSort() ?? null;
  } else {
    sortState.value.colId = "";
    sortState.value.key = "";
    sortState.value.dir = null;
  }
}

function handleGridSelection({ api, source }: SelectionChangedEvent) {
  if (source === "uiSelectAll") selectAll.value = !selectAll.value;
  else selected.value = api.getSelectedRows();
}

function handleGridScrollEnd({ api }: BodyScrollEvent) {
  topViewportOffset.value = api.getVerticalPixelRange().top;
}

function handleRowDrag(params: RowDragEvent) {
  const orderedRows: Record<string, any>[] = [];
  params.api.forEachNode((rowNode, index) => orderedRows.push(rowNode.data));
  props?.onRowDrag?.({
    rows: orderedRows,
    movedRows: params.nodes.map((node) => node.data),
    tableApi: tableApi.value as TableApi,
  });
}

function handleGridInitialization(params: GridReadyEvent) {
  gridApi.value = params.api;
  columnApi.value = params.columnApi;
  isGridMounted.value = true;

  params.api.setAlwaysShowVerticalScroll(true);
  params.api.setAlwaysShowHorizontalScroll(true);
  if (props.columnFitMode === "fit") params.columnApi.autoSizeAllColumns();

  if (topViewportOffset.value)
    document
      .querySelector(".ag-body-viewport")
      ?.scrollBy(0, topViewportOffset.value);

  if (sortState.value.colId)
    columnApi.value?.applyColumnState({
      state: [
        {
          colId: sortState.value.colId,
          sort: sortState.value.dir,
        },
      ],
    });
}

// watch(
//   () => selectAll.value,
//   (value: boolean) => {
//     value ? gridApi.value?.selectAll() : gridApi.value?.deselectAll();
//   }
// );
</script>

<template>
  <NCard
    embedded
    :bordered="!props.borderless"
    content-style="padding: 0;"
    class="datagrid"
    :segmented="{ content: true }"
  >
    <template #header>
      <TableHeader
        v-model:search-query="filterState.searchQuery"
        v-model:panel-filters="filterState.panelFilters"
        :filters="filters"
        :dropdown-actions="mappedActions"
        :nb-selected="nbSelected"
        :enable-search-query="searchQuery.length > 0"
        :resolve-grid-data="() => resolveGridData(true)"
        :table-key="tableKey"
      >
        <slot />
      </TableHeader>
    </template>

    <div ref="gridContainer" class="flex flex-col gap-0">
      <NSpin :show="isLoading">
        <AgGridVue
          ref="gridRef"
          class="ag-theme-material w-full h-[56vh]"
          :column-defs="columnDefs"
          :row-data="data"
          :default-col-def="defaultColumnDef"
          :grid-options="gridOptions"
          row-selection="multiple"
          animate-rows
          enable-range-selection
          enable-cell-text-selection
          auto-params-refresh
          suppress-pagination-panel
          :suppress-scroll-on-new-data="false"
          always-show-horizontal-scroll
          always-show-vertical-scroll
          row-drag-managed
          row-drag-multi-row
          @sort-changed="handleGridSort"
          @selection-changed="handleGridSelection"
          @body-scroll-end="handleGridScrollEnd"
          @row-drag-end="handleRowDrag"
          @grid-ready="handleGridInitialization"
        />
      </NSpin>
    </div>

    <template #action>
      <TableFooter v-model:pagination-state="paginationState" />
    </template>
  </NCard>
</template>

<style lang="scss">
@import "ag-grid-community/styles/ag-grid.min.css";
@import "ag-grid-community/styles/ag-theme-material.min.css";

.ag-theme-material {
  --ag-foreground-color: v-bind("themeVars.textColorBase");
  --ag-background-color: v-bind("themeVars.modalColor");
  --ag-header-background-color: v-bind("themeVars.modalColor");
  --ag-header-foreground-color: v-bind("themeVars.textColorBase");
  --ag-border-color: v-bind("borderColor");
  --ag-row-hover-color: v-bind("hoverCellColor");
  --ag-column-hover-color: v-bind("themeVars.bodyColor");
  --ag-border-radius: v-bind("themeVars.borderRadius");
  --ag-cell-horizontal-border: none;
  --ag-cell-horizontal-border: transparent;
  --ag-material-accent-color: v-bind("themeVars.primaryColor");
  --ag-header-cell-moving-background-color: v-bind("themeVars.primaryColor");
  --ag-header-cell-moving-background-color: v-bind("themeVars.primaryColor");
  --ag-selected-tab-underline-color: v-bind("themeVars.primaryColor");
  --ag-input-focus-border-color: v-bind("themeVars.primaryColor");
  --ag-checkbox-background-color: v-bind("borderColor");
  --ag-selected-row-background-color: v-bind("selectedCellColor") !important;
  --ag-header-cell-hover-background-color: v-bind(
    "selectedCellColor"
  ) !important;
  ::-webkit-scrollbar {
    width: calc(v-bind("themeVars.scrollbarWidth") * 1.5);
    height: calc(v-bind("themeVars.scrollbarWidth") * 1.5);
  }

  ::-webkit-scrollbar-thumb {
    background: v-bind("themeVars.scrollbarColor");
    border-radius: 20px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 20px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: v-bind("themeVars.primaryColor");
  }

  .ag-row,
  .ag-header,
  .ag-header-cell,
  .ag-header-group-cell,
  .ag-row,
  .ag-pinned-left-header,
  .ag-horizontal-left-spacer,
  .ag-horizontal-right-spacer {
    border-left: none;
    border-right: none;
    border-top: none;
    min-height: 55px;
    font-weight: 300;
    font-family: "Lato";
  }

  .ag-row-hover,
  .ag-row-selected,
  .ag-header-cell-hover,
  .ag-header-cell:hover {
    background: v-bind("themeVars.bodyColor") !important;
  }

  .ag-floating-filter:hover {
    background: v-bind("themeVars.modalColor") !important;
  }

  .ag-header .ag-header-cell {
    font-weight: 900 !important;
  }

  .ag-header-cell:hover {
    background: v-bind("themeVars.bodyColor");
  }

  .ag-icon-checkbox-checked,
  .ag-icon-checkbox-indeterminate {
    font-size: 22px;
    color: v-bind("themeVars.primaryColor") !important;
  }

  .ag-icon,
  .ag-header-icon {
    color: v-bind("themeVars.primaryColor") !important;
  }

  .ag-tool-panel-wrapper {
    background: v-bind("themeVars.borderColor");
    color: v-bind("themeVars.textColorBase");
    margin-left: 5px;
    // border: 2px solid v-bind("themeVars.borderColor");
  }

  .ag-group,
  .ag-filter-toolpanel-group {
    background: v-bind("themeVars.modalColor");
  }

  .ag-cell-focus {
    border: transparent !important;
    background: v-bind("themeVars.avatarColor");
  }
}
</style>
