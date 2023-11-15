import type { DataApi, DataResolverState, FullQueryState } from '../types/shared'

export function useDataApi({
  resolver,
  queryState,
}: {
  resolver: DataResolverState
  queryState: FullQueryState
}): DataApi {
  return {
    refreshData: () => resolver.resolveGridData(true),
    setSearchQuery: value =>
      (queryState.filterState.value.searchQuery = value),
    resetFilters: () => queryState.initializeFilterState(true),
    setSort: (key, dir = null) => {
      queryState.sortState.value.key = key
      queryState.sortState.value.dir = dir
    },
    setPage: page => (queryState.paginationState.value.pageIndex = page),
    setPageSize: size => (queryState.paginationState.value.pageSize = size),
    updateRow: (rowSelector, rowUpdater) => {
      const rowIndex = queryState.data.value.findIndex(rowSelector)
      if (rowIndex === -1)
        return false

      queryState.data.value[rowIndex] = {
        ...queryState.data.value[rowIndex],
        ...rowUpdater(queryState.data.value[rowIndex]),
      }
      return true
    },
    updateRows: (rowsSelector, rowsUpdater) => {
      const rowIndexes = queryState.data.value.reduce(
        (acc, curr, index) => [...acc, ...(rowsSelector(curr) ? [index] : [])],
        [] as number[],
      )

      for (const index of rowIndexes) {
        queryState.data.value[index] = {
          ...queryState.data.value[index],
          ...rowsUpdater(queryState.data.value[index]),
        }
      }

      return !!rowIndexes.length
    },
  }
}
