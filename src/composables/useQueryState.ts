import { mapFilterInitialState } from "@/utils/table/mapFilterInitialState";
import { mapQueryFetchParams } from "@/utils/table/mapQueryFetchParams";
import {
  DataTableSchema,
  GridControls,
  OptimizedQueryField,
  StaticFilter,
  TableFilter,
} from "./../types/table";
import { useStorage } from "@vueuse/core";
import { ComputedRef, computed, ref } from "vue";

export function useQueryState(
  tableKey: string,
  searchQueryFields: string[],
  optimizeQuery: OptimizedQueryField[],
  panelFilters: ComputedRef<TableFilter[]>,
  staticFilters: ComputedRef<StaticFilter[]>,
  persistency: false | "localStorage" | "sessionStorage",
  defaultSort: ComputedRef<DataTableSchema["sort"]>
) {
  const isLoading = ref<boolean>(false);
  const data = ref<Record<string, any>[]>([]);
  const selected = ref<Record<string, any>[]>([]);
  const selectAll = ref<boolean>(false);
  const nbSelected = computed<number>(() =>
    selectAll.value
      ? paginationState.value.rowTotalCount
      : selected.value.length
  );

  const topViewportOffset = !persistency
    ? ref<number>(0)
    : useStorage<number>(
        `${tableKey}__#viewportTopRow`,
        0,
        persistency === "localStorage" ? localStorage : sessionStorage
      );

  const sortState = !persistency
    ? ref<GridControls["sort"]>({ colId: "", key: "", dir: null })
    : useStorage<GridControls["sort"]>(
        `${tableKey}__#sortState`,
        { colId: "", key: "", dir: null },
        persistency === "localStorage" ? localStorage : sessionStorage
      );

  const paginationState = !persistency
    ? ref<GridControls["pagination"]>({
        pageSize: 50,
        pageIndex: 1,
        pageTotalCount: 1,
        rowTotalCount: 0,
      })
    : useStorage<GridControls["pagination"]>(
        `${tableKey}__#paginationstate`,
        { pageSize: 50, pageIndex: 1, pageTotalCount: 1, rowTotalCount: 0 },
        persistency === "localStorage" ? localStorage : sessionStorage
      );

  const filterState = !persistency
    ? ref<GridControls["filters"]>({
        searchQuery: "",
        panelFilters: {},
        staticFilters: {},
      })
    : useStorage<GridControls["filters"]>(
        `${tableKey}__#filtersState`,
        { searchQuery: "", panelFilters: {}, staticFilters: {} },
        persistency === "localStorage" ? localStorage : sessionStorage
      );

  const fetchParams = computedWithControl([], () => ({
    page: paginationState.value.pageIndex,
    limit: paginationState.value.pageSize,
    sortKey:
      (sortState.value.key || defaultSort.value?.key) ??
      ((defaultSort?.value as unknown as string) || ""),
    sortOrder: sortState.value.key
      ? sortState.value?.dir ?? "asc"
      : defaultSort?.value?.dir ?? "asc",
    searchQuery: filterState.value.searchQuery
      ? { value: filterState.value.searchQuery, fields: searchQueryFields }
      : null,
    ...(optimizeQuery?.length && { select: optimizeQuery }),
    query: mapQueryFetchParams(
      filterState.value.panelFilters,
      panelFilters.value,
      staticFilters.value
    ),
  }));

  watch(
    [
      () => paginationState.value.pageSize,
      () => paginationState.value.pageIndex,
      () => sortState.value,
      () => filterState.value,
    ],
    () => fetchParams.trigger()
  );

  function initializeFilterState(clearMode: boolean) {
    filterState.value.panelFilters = mapFilterInitialState(
      panelFilters.value,
      filterState.value.panelFilters,
      clearMode
    );

    filterState.value.staticFilters = mapFilterInitialState(
      staticFilters.value as unknown as TableFilter[],
      filterState.value.staticFilters,
      clearMode
    );
  }

  return {
    isLoading,
    data,
    selected,
    selectAll,
    nbSelected,
    sortState,
    paginationState,
    filterState,
    fetchParams,
    topViewportOffset,
    initializeFilterState,
  };
}
