import { DataSource, FetchParams, GridControls } from "@/types/table";
import { GenericObject } from "@/types/utils";
import { obsoletableFn } from "@/utils/obsoletableFn";
import { remoteDataMapper } from "@/utils/table/remoteDataMapper";
import { RemovableRef } from "@vueuse/core";
import { GridApi } from "ag-grid-community";
import { ComputedRef, Ref } from "vue";
import { watchDebounced } from "@vueuse/core";

export function useDataResolver(
  remote: ComputedRef<boolean>,
  isLoading: Ref<boolean>,
  data: Ref<GenericObject[]>,
  datasource: DataSource<any>,
  pagination: RemovableRef<GridControls["pagination"]>,
  fetchParams: Readonly<Ref<FetchParams>>,
  gridApi: Ref<GridApi | undefined>,
  allSelected: Ref<boolean>
) {
  const localDataStore = ref<GenericObject[]>();

  const resolveGridData = obsoletableFn(
    async (isObsolete, fullReload: boolean, run = new Date().toISOString()) => {
      try {
        isLoading.value = true;
        const { docs, totalPages, totalDocs, ...rest } = remote.value
          ? await (datasource as unknown as DataSource<any, true>)(
              fetchParams.value
            )
          : await remoteDataMapper(
              localDataStore?.value ?? [],
              datasource as unknown as DataSource<any, false>,
              fetchParams.value,
              fullReload
            );

        if (isObsolete()) return;
        if (fullReload && !remote.value)
          localDataStore.value = (rest as { rawDocs: GenericObject[] }).rawDocs;

        data.value = docs;
        pagination.value.pageTotalCount = totalPages;
        pagination.value.rowTotalCount = totalDocs;
        isLoading.value = false;

        if (totalPages < pagination.value.pageIndex)
          pagination.value.pageIndex = totalPages < 1 ? 1 : totalPages;

        await nextTick();
        if (allSelected.value) gridApi.value?.selectAll();
      } catch (err) {
        console.error(err);
        isLoading.value = false;
      }
    }
  );

  ref<FetchParams>(fetchParams.value);
  watchDebounced(
    () => fetchParams.value,
    () => {
      resolveGridData(!Array.isArray(localDataStore.value));
    },
    {
      deep: true,
      immediate: true,
      debounce: 50,
    }
  );

  return {
    resolveGridData,
    localDataStore,
  };
}
