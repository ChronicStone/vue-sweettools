<script setup lang="ts">
import { withDefaults } from "unplugin-vue-macros/macros" assert { type: "macro" };
import ListHeader from "./layout/ListHeader.vue";
import ListItem from "./content/ListItem.vue";
import ListPagination from "./layout/ListPagination.vue";
import { NEmpty, NSkeleton, NCard, NScrollbar } from "naive-ui";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { useDataActions } from "./composables/useDataActions";
import type { DataTableSchema } from "@/types/datatable";
import { useDataApi } from "./composables/useDataApi";

const {
  tableKey,
  columns,
  expandedContent,
  remote,
  datasource,
  rowActions,
  persistency,
  filters,
  staticFilters,
  searchQuery,
  defaultSort,
  defaultPageSize,
  sortOptions,
  maxHeight,
  actions,
  selection,
  rowIdKey,
  pagination,
} = withDefaults(definePropsRefs<DataTableSchema>(), {
  tableKey: () => "DEFAULT_LIST",
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
});

const queryState = useQueryState({
  key: `${tableKey.value ?? "DEFAULT_LIST"}_LIST_STATE`,
  searchQuery: searchQuery.value,
  optimizeQuery: [],
  panelFilters: filters,
  staticFilters: staticFilters,
  persistency: persistency.value,
  defaultSort: defaultSort,
  defaultPageSize: defaultPageSize.value,
});

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
});

const dataApi = useDataApi({ queryState, resolver });
const mappedActions = useDataActions({
  actions,
  fetchParams: queryState.fetchParams,
  data: remote.value ? queryState.data : resolver.localDataStore,
  internalApi: dataApi,
  selectionState: queryState,
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <ListHeader
      v-model:select-all="queryState.selectAll.value"
      v-model:search-query="queryState.filterState.value.searchQuery"
      v-model:panel-filters="queryState.filterState.value.panelFilters"
      :sort="queryState.sortState.value"
      :sort-options="sortOptions"
      :filters="filters"
      :dropdown-actions="mappedActions"
      :nb-selected="queryState.nbSelected.value"
      :enable-search-query="searchQuery.length > 0"
      :resolve-grid-data="() => resolver.resolveGridData(true)"
      :reset-table-query="() => queryState.resetTableQuery()"
      :list-key="tableKey"
      :tooltip-show-delay="100"
      @update:sort="queryState.setSort"
    >
      <slot />
    </ListHeader>
  </div>
</template>
