import { mapFilterInitialState } from "./../utils/mapFilterInitialState";
import { mapQueryFetchParams } from "@/utils/mapQueryFetchParams";
import {
  GridControls,
  OptimizedQueryField,
  StaticFilter,
  TableFilter,
} from "./../types/table";
import { FetchParams } from "@/types/table";
import { useStorage } from "@vueuse/core";
import { ComputedRef, computed, ref } from "vue";
import { useRoute } from "vue-router";

export function useQueryState(
  tableKey: string,
  searchQueryFields: string[],
  optimizeQuery: OptimizedQueryField[],
  panelFilters: ComputedRef<TableFilter[]>,
  staticFilters: ComputedRef<StaticFilter[]>,
  persistency: false | "localStorage" | "sessionStorage"
) {
  const route = useRoute();
  const isLoading = ref<boolean>(false);
  const data = ref<Record<string, any>[]>([]);
  const selected = ref<Record<string, any>[]>([]);
  const selectAll = ref<boolean>(false);
  const nbSelected = computed<number>(() =>
    selectAll.value
      ? paginationState.value.rowTotalCount
      : selected.value.length
  );

  const topViewportRowIndex = !persistency
    ? ref<number>(0)
    : useStorage<number>(
        `${tableKey}__${route?.name?.toString?.() ?? ""}__#viewportTopRow`,
        0,
        persistency === "localStorage" ? localStorage : sessionStorage
      );

  const sortState = !persistency
    ? ref<GridControls["sort"]>({ colId: "", key: "", dir: null })
    : useStorage<GridControls["sort"]>(
        `${tableKey}__${route?.name?.toString?.() ?? ""}__#sortState`,
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
        `${tableKey}__${route?.name?.toString?.() ?? ""}__#paginationstate`,
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
        `${tableKey}__${route?.name?.toString?.() ?? ""}__#filtersState`,
        { searchQuery: "", panelFilters: {}, staticFilters: {} },
        persistency === "localStorage" ? localStorage : sessionStorage
      );

  const fetchParams = computed<FetchParams>(() => ({
    page: paginationState.value.pageIndex,
    limit: paginationState.value.pageSize,
    sortKey: sortState.value.key,
    sortOrder: sortState.value.dir,
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
    topViewportRowIndex,
    initializeFilterState,
  };
}
