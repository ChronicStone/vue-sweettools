import { DataSource, FetchParams, GridControls } from "@/types/table";
import { GenericObject } from "@/types/utils";
import { obsoletableFn } from "@/utils/obsoletableFn";
import { remoteDataMapper } from "@/utils/table/remoteDataMapper";
import { ComputedRefWithControl, RemovableRef } from "@vueuse/core";
import { GridApi } from "ag-grid-community";
import { ComputedRef, Ref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { QueryState } from "@/types/lib";

type DataResolverParams = {
  remote: ComputedRef<boolean>;
  isLoading: Ref<boolean>;
  data: Ref<GenericObject[]>;
  datasource: DataSource<GenericObject, boolean>;
  pagination: QueryState["paginationState"];
  fetchParams: QueryState["fetchParams"];
  gridApi?: Ref<GridApi | undefined>;
  allSelected: Ref<boolean>;
  enablePagination?: boolean;
  rowKey?: string;
};

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
  const initialized = ref<boolean>(false);
  const localDataStore = ref<(GenericObject & { __$ROW_ID__: string })[]>([]);

  const resolveGridData = obsoletableFn(
    async (isObsolete, fullReload: boolean) => {
      try {
        isLoading.value = true;
        const { docs, totalPages, totalDocs, ...rest } = remote.value
          ? await Promise.resolve(
              (datasource as unknown as DataSource<GenericObject, true>)(
                fetchParams.value as unknown as FetchParams
              )
            ).then((res) => ({
              ...res,
              docs: res.docs.map((item) => ({
                ...item,
                __$ROW_ID__: rowKey
                  ? propertyResolver(rowKey, [], item) ?? generateUUID()
                  : generateUUID(),
              })),
            }))
          : await remoteDataMapper(
              localDataStore?.value ?? [],
              datasource as unknown as DataSource<GenericObject, false>,
              fetchParams.value as unknown as FetchParams,
              fullReload,
              enablePagination,
              rowKey
            );

        if (isObsolete()) return;
        if (fullReload && !remote.value)
          localDataStore.value = (
            rest as { rawDocs: (GenericObject & { __$ROW_ID__: string })[] }
          ).rawDocs;

        data.value = docs;
        pagination.value.pageTotalCount = totalPages;
        pagination.value.rowTotalCount = totalDocs;
        isLoading.value = false;

        if (totalPages < pagination.value.pageIndex)
          pagination.value.pageIndex = totalPages < 1 ? 1 : totalPages;

        await nextTick();
        if (allSelected.value) gridApi?.value?.selectAll();
      } catch (err) {
        console.error(err);
        isLoading.value = false;
      }
    }
  );

  watchDebounced(
    () => fetchParams.value,
    () => {
      resolveGridData(!initialized.value);
      initialized.value = true;
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
