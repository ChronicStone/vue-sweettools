import {
  DataSource,
  DataTableSchema,
  FetchParams,
  GridControls,
} from "@/types/table";
import { GenericObject } from "@/types/utils";
import { obsoletableFn } from "@/utils/obsoletableFn";
import { remoteDataMapper } from "@/utils/table/remoteDataMapper";
import { RemovableRef } from "@vueuse/core";
import { GridApi } from "ag-grid-community";
import { ComputedRef, Ref } from "vue";

export function useDataResolver(
  remote: ComputedRef<boolean>,
  isLoading: Ref<boolean>,
  data: Ref<GenericObject[]>,
  datasource: DataSource<any>,
  pagination: RemovableRef<GridControls["pagination"]>,
  fetchParams: ComputedRef<FetchParams>,
  gridApi: Ref<GridApi | undefined>,
  allSelected: Ref<boolean>
) {
  const localDataStore = ref<GenericObject[]>();

  const resolveGridData = obsoletableFn(
    async (isObsolete, fullReload: boolean, run = new Date().toISOString()) => {
      console.log("resolveGridData::start", run);
      try {
        isLoading.value = true;
        const { docs, totalPages, totalDocs, ...rest } = remote.value
          ? await (datasource as unknown as DataSource<any, "remote">)(
              fetchParams.value
            )
          : await remoteDataMapper(
              localDataStore?.value ?? [],
              datasource as unknown as DataSource<any, "local">,
              fetchParams.value,
              fullReload
            );

        if (isObsolete()) return;
        if (fullReload && !remote.value)
          localDataStore.value = (rest as { rawDocs: GenericObject[] }).rawDocs;

        console.log("resolveGridData::data::resolved", run);

        data.value = docs;
        pagination.value.pageTotalCount = totalPages;
        pagination.value.rowTotalCount = totalDocs;
        isLoading.value = false;

        console.log("resolveGridData::data::saved", run);

        if (totalPages < pagination.value.pageIndex)
          pagination.value.pageIndex = totalPages < 1 ? 1 : totalPages;

        await nextTick();
        if (allSelected.value) gridApi.value?.selectAll();

        console.log("resolveGridData::end", run);
      } catch (err) {
        console.error(err);
        isLoading.value = false;
      }
    }
  );

  watch(
    () => fetchParams.value,
    () => resolveGridData(Array.isArray(localDataStore.value) ? false : true),
    { deep: true, immediate: true }
  );

  return {
    resolveGridData,
  };
}
