import type { ComputedRef, Ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import type { DataSource, FetchParams, FullQueryState } from '../types/shared'
import type { GenericObject } from '@/_shared/types/utils'

type DataResolverParams = {
  remote: ComputedRef<boolean>
  isLoading: Ref<boolean>
  data: Ref<GenericObject[]>
  datasource: DataSource
  pagination: FullQueryState['paginationState']
  fetchParams: FullQueryState['fetchParams']
  gridApi?: Ref<any | undefined>
  allSelected: Ref<boolean>
  enablePagination?: boolean
  rowKey?: string
}

export function useDataResolver({
  remote,
  isLoading,
  data,
  datasource,
  pagination,
  fetchParams,
  gridApi,
  allSelected,
  enablePagination,
  rowKey,
}: DataResolverParams) {
  const initialized = ref<boolean>(false)
  const localDataStore = ref<(GenericObject & { __$ROW_ID__: string })[]>([])

  const resolveGridData = obsoletableFn(
    async (isObsolete, fullReload: boolean) => {
      try {
        isLoading.value = true
        const { docs, totalPages, totalDocs, ...rest } = remote.value
          ? await Promise.resolve(
            (datasource as unknown as DataSource<GenericObject, true>)(
              fetchParams.value as unknown as FetchParams,
            ),
          ).then(res => ({
            ...res,
            docs: res.docs.map(item => ({
              ...item,
              __$ROW_ID__: rowKey
                ? getObjectProperty(rowKey, [], item) ?? generateUUID()
                : generateUUID(),
            })),
          }))
          : await remoteDataMapper(
            localDataStore?.value ?? [],
            datasource as unknown as DataSource<GenericObject, false>,
            fetchParams.value as unknown as FetchParams,
            fullReload,
            enablePagination,
            rowKey,
          )

        if (isObsolete())
          return
        if (fullReload && !remote.value) {
          localDataStore.value = (
            rest as { rawDocs: (GenericObject & { __$ROW_ID__: string })[] }
          ).rawDocs
        }

        data.value = docs
        pagination.value.pageTotalCount = totalPages
        pagination.value.rowTotalCount = totalDocs
        isLoading.value = false

        if (totalPages < pagination.value.pageIndex)
          pagination.value.pageIndex = totalPages < 1 ? 1 : totalPages

        await nextTick()
        if (allSelected.value)
          gridApi?.value?.selectAll()
      }
      catch (err) {
        console.error(err)
        isLoading.value = false
      }
    },
  )

  watchDebounced(
    () => fetchParams.value,
    () => {
      resolveGridData(!initialized.value)
      initialized.value = true
    },
    {
      deep: true,
      immediate: true,
      debounce: 50,
    },
  )

  return {
    resolveGridData,
    localDataStore,
  }
}
