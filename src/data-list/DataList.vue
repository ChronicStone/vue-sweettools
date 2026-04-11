<script setup lang="ts">
import { NCard, NEmpty, NScrollbar, NSkeleton } from 'naive-ui'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import type { DataListSchema } from './types/datalist'
import Lazy from '@/_shared/components/Lazy.vue'

const {
  expandedContent,
  expandable,
  content,
  remote,
  datasource,
  rowActions,
  persistency,
  listKey,
  filters,
  staticFilters,
  searchQuery,
  defaultSort,
  pagination,
  defaultPageSize,
  sortOptions,
  maxHeight,
  actions,
  selection,
  rowIdKey,
  compact,
  frameless,
  footerClass,
  footerStyle,
  headerClass,
  headerStyle,
} = defineProps<DataListSchema>()

const listKeyRef = computed(() => listKey ?? 'DEFAULT_LIST')
const filtersRef = computed(() => filters ?? [])
const staticFiltersRef = computed(() => staticFilters ?? [])
const searchQueryRef = computed(() => searchQuery ?? [])
const defaultSortRef = computed(() => defaultSort)
const remoteRef = computed(() => remote)
const actionsRef = computed(() => actions ?? [])
const rowActionsRef = computed(() => rowActions ?? [])

const sortOptionsWithDefault = computed(() => sortOptions ?? [])
const maxHeightWithDefault = computed(() => maxHeight ?? '56vh')
const paginationWithDefault = computed(() => pagination ?? true)
const selectionWithDefault = computed(() => selection ?? true)
const compactWithDefault = computed(() => compact ?? false)
const framelessWithDefault = computed(() => frameless ?? false)
const footerClassWithDefault = computed(() => footerClass)
const footerStyleWithDefault = computed(() => footerStyle)
const headerClassWithDefault = computed(() => headerClass)
const headerStyleWithDefault = computed(() => headerStyle)

const defaultPageSizeWithDefault = computed(() => defaultPageSize)
const rowIdKeyWithDefault = computed(() => rowIdKey)

const scrollbarContainerRef = ref<InstanceType<typeof NScrollbar>>()

const queryState = useQueryState({
  key: `${listKeyRef.value}_LIST_STATE`,
  searchQuery: searchQueryRef.value,
  optimizeQuery: [],
  panelFilters: filtersRef,
  quickFilters: computed(() => []),
  staticFilters: staticFiltersRef,
  persistency,
  defaultSort: defaultSortRef,
  defaultPageSize: defaultPageSizeWithDefault.value,
})

const resolver = useDataResolver({
  remote: remoteRef,
  datasource,
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
const lastSelectedRowId = ref<string | null>(null)
const mappedActions = useDataActions({
  actions: actionsRef,
  fetchParams: queryState.fetchParams,
  data: remote ? queryState.data : resolver.localDataStore,
  internalApi: dataApi,
  selectionState: queryState,
})

function handleSortUpdate(sort: { key: string; dir: 'asc' | 'desc' | null } | null) {
  queryState.setSort(sort?.dir ? { key: sort.key, dir: sort.dir } : null)
}

watch(
  () => queryState.paginationState.value.pageIndex,
  () => scrollbarContainerRef.value?.scrollTo(0, 0),
)

watch(
  () => queryState.selectAll.value,
  (v) => {
    queryState.selectedKeys.value = !v
      ? []
      : [...resolver.localDataStore.value.map(d => d.__$ROW_ID__)]

    lastSelectedRowId.value = null
  },
)

// watch(
//   () => queryState.selectedKeys.value,
//   () =>
//     (queryState.selected.value = resolver.localDataStore.value.filter(d =>
//       queryState.selectedKeys.value.includes(d.__$ROW_ID__),
//     )),
// )
function handleSelection(
  value: boolean,
  shiftKey: boolean,
  rowIndex: number,
  rowKey: string,
) {
  if (!shiftKey) {
    if (value) {
      queryState.selectedKeys.value = [
        ...new Set([...queryState.selectedKeys.value, rowKey]),
      ]
    }
    else {
      queryState.selectedKeys.value = queryState.selectedKeys.value.filter(
        k => k !== rowKey,
      )
    }
  }
  else {
    const indexRange = [
      queryState.data.value.findIndex(
        d => d.__$ROW_ID__ === lastSelectedRowId.value,
      ) ?? rowIndex,
      rowIndex,
    ]

    const keysToSelect: string[] = []
    for (let i = indexRange[0]; i <= indexRange[1]; i++)
      keysToSelect.push(queryState.data.value[i].__$ROW_ID__)

    if (value) {
      queryState.selectedKeys.value = [
        ...new Set([...queryState.selectedKeys.value, ...keysToSelect]),
      ]
    }
    else {
      queryState.selectedKeys.value = queryState.selectedKeys.value.filter(
        k => !keysToSelect.includes(k.toString()),
      )
    }
  }
  lastSelectedRowId.value = rowKey
}
</script>

<template>
  <CardContainer
    content="list"
    :frameless="framelessWithDefault"
    :compact="compactWithDefault"
  >
    <template #header>
      <ListHeader
        v-model:select-all="queryState.selectAll.value"
        v-model:search-query="queryState.filterState.value.searchQuery"
        v-model:panel-filters="queryState.filterState.value.panelFilters"
        show-select-all
        :sort="queryState.sortState.value"
        :sort-options="sortOptionsWithDefault"
        :filters="filtersRef"
        :dropdown-actions="mappedActions"
        :nb-selected="queryState.nbSelected.value"
        :enable-search-query="searchQueryRef.length > 0"
        :resolve-grid-data="() => resolver.resolveGridData(true)"
        :reset-table-query="() => queryState.resetTableQuery()"
        :list-key="listKeyRef"
        :compact="compactWithDefault"
        :selected-keys="queryState.selectedKeys.value"
        :enable-selection="selectionWithDefault"
        :header-class="headerClassWithDefault"
        :header-style="headerStyleWithDefault"
        @update:sort="handleSortUpdate"
      >
        <slot />
      </ListHeader>
    </template>

    <div v-if="queryState.isLoading.value" class="flex flex-col gap-4">
      <NCard v-for="i in 10" :key="i">
        <div
          class="flex flex-col !md:flex-row gap-4 justify-between items-center"
        >
          <div class="flex items-center gap-4">
            <NSkeleton :sharp="false" style="width: 80px; height: 80px" />
            <div class="flex flex-col justify-center gap-2">
              <NSkeleton :sharp="false" style="width: 160px; height: 20px" />
              <NSkeleton :sharp="false" style="width: 160px; height: 12px" />
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <NSkeleton
                style="width: 50px; height: 30px"
                :sharp="false"
                :repeat="2"
              />
            </div>
          </div>
        </div>
      </NCard>
    </div>

    <NScrollbar
      ref="scrollbarContainerRef"
      :style="{ ...(maxHeightWithDefault === false ? {} : { maxHeight: maxHeightWithDefault }) }"
    >
      <div
        v-auto-animate
        page-mode
        :items="queryState.data.value"
        class="flex flex-col gap-4"
      >
        <Lazy
          v-for="(item, index) in queryState.data.value"
          :key="item.__$ROW_ID__"
          v-memo="[
            item,
            queryState.selectedKeys.value.some((i) => i === item.__$ROW_ID__),
          ]"
          :min-height="80"
          render-on-idle
          :identifier="(item.firstName as string)"
        >
          <ListItem
            :compact="compactWithDefault"
            :data="item"
            :content="content"
            :expanded-content="expandedContent"
            :expandable="expandable"
            :enable-selection="selectionWithDefault"
            :row-actions="rowActionsRef"
            :select-all="queryState.selectAll.value"
            :selected="
              queryState.selectedKeys.value.some((i) => i === item.__$ROW_ID__)
            "
            :list-api="dataApi"
            @update:selected="
              (value, shiftKey) =>
                handleSelection(value, shiftKey, index, item.__$ROW_ID__)
            "
          />
        </Lazy>
      </div>

      <div
        v-if="!queryState.data.value.length"
        class="h-120 grid place-items-center"
      >
        <NEmpty description="No data" />
      </div>
    </NScrollbar>

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
</template>
