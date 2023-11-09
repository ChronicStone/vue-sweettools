import { mapFilterInitialState } from "@/utils/table/mapFilterInitialState";
import { mapQueryFetchParams } from "@/utils/table/mapQueryFetchParams";
import {
  DataTableSchema,
  FetchParams,
  GridControls,
  OptimizedQueryField,
  StaticFilter,
  TableFilter,
} from "./../types/table";
import { useStorage } from "@vueuse/core";
import { ComputedRef, computed, ref } from "vue";
import { GenericObject } from "@/types/utils";

type QueryStateParams = {
  key: string;
  searchQuery: string[];
  optimizeQuery: OptimizedQueryField[];
  panelFilters: ComputedRef<TableFilter[]>;
  staticFilters: ComputedRef<StaticFilter[]>;
  persistency: undefined | false | "localStorage" | "sessionStorage";
  defaultSort: ComputedRef<
    undefined | string | { key: string; dir: "asc" | "desc" }
  >;
  defaultPageSize?: number;
};

export function useQueryState({
  key,
  searchQuery,
  optimizeQuery,
  panelFilters,
  staticFilters,
  persistency,
  defaultSort,
  defaultPageSize,
}: QueryStateParams) {
  const isLoading = ref<boolean>(true);
  const data = ref<(GenericObject & { __$ROW_ID__: string })[]>([]);
  const selected = ref<Record<string, any>[]>([]);
  const selectedKeys = ref<(string | number)[]>([]);
  const selectAll = ref<boolean>(false);
  const nbSelected = computed<number>(() =>
    selectAll.value
      ? paginationState.value.rowTotalCount
      : selected.value.length || selectedKeys.value.length
  );

  const topViewportOffset = !persistency
    ? ref<number>(0)
    : useStorage<number>(
        `${key}__#viewportTopRow`,
        0,
        persistency === "localStorage" ? localStorage : sessionStorage
      );

  const sortState = !persistency
    ? ref<GridControls["sort"]>({ colId: "", key: "", dir: null })
    : useStorage<GridControls["sort"]>(
        `${key}__#sortState`,
        { colId: "", key: "", dir: null },
        persistency === "localStorage" ? localStorage : sessionStorage
      );

  const paginationState = !persistency
    ? ref<GridControls["pagination"]>({
        pageSize: defaultPageSize ?? 50,
        pageIndex: 1,
        pageTotalCount: 1,
        rowTotalCount: 0,
      })
    : useStorage<GridControls["pagination"]>(
        `${key}__#paginationstate`,
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
        `${key}__#filtersState`,
        { searchQuery: "", panelFilters: {}, staticFilters: {} },
        persistency === "localStorage" ? localStorage : sessionStorage
      );

  const fetchParams = computedWithControl(
    [],
    () =>
      ({
        page: paginationState.value.pageIndex,
        limit: paginationState.value.pageSize,
        sortKey:
          sortState.value.key ||
          (typeof defaultSort.value === "object" && "key" in defaultSort.value
            ? defaultSort.value?.key
            : defaultSort.value ?? ""),
        sortOrder:
          sortState.value.dir ||
          (typeof defaultSort.value === "object" && "dir" in defaultSort.value
            ? defaultSort.value?.dir
            : defaultSort.value ?? "asc"),
        searchQuery: filterState.value.searchQuery
          ? { value: filterState.value.searchQuery, fields: searchQuery }
          : null,
        ...(optimizeQuery?.length && { select: optimizeQuery }),
        query: mapQueryFetchParams(
          filterState.value.panelFilters,
          panelFilters.value,
          staticFilters.value
        ),
      } as FetchParams)
  );

  watch(
    [
      () => paginationState.value.pageSize,
      () => paginationState.value.pageIndex,
      () => sortState.value,
      () => filterState.value,
      () => staticFilters.value,
    ],
    () => fetchParams.trigger(),
    { deep: true }
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

  function resetTableQuery() {
    paginationState.value.pageIndex = 1;
    sortState.value = { colId: "", key: "", dir: null };
    filterState.value.searchQuery = "";
    initializeFilterState(true);
  }

  return {
    isLoading,
    data,
    selected,
    selectedKeys,
    selectAll,
    nbSelected,
    sortState,
    paginationState,
    filterState,
    fetchParams,
    topViewportOffset,
    initializeFilterState,
    resetTableQuery,
  };
}
