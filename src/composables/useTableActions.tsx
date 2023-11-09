/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FetchParams, TableAction, TableApi } from "@/types/table";
import { GenericObject } from "@/types/utils";
import { generateUUID } from "@/utils/generateUUID";
import { renderIcon } from "@/utils/renderIcon";
import { ComputedRef, Ref } from "vue";
import { RouteLocationRaw, RouterLink } from "vue-router";
import { type DropdownOption } from "naive-ui";
import { QueryState } from "@/types/lib";
import { DataListApi } from "@/types/datalist";

export function useTableActions<
  T extends "table" | "list" = "table",
  IApi extends TableApi | DataListApi = T extends "table"
    ? TableApi
    : DataListApi,
  TAction extends TableAction = T extends "table"
    ? TableAction<GenericObject, string, "table">
    : TableAction<GenericObject, string, "list">
>(params: {
  actions: ComputedRef<TAction[]>;
  internalApi: Ref<IApi | undefined>;
  fetchParams: QueryState["fetchParams"];
  data: QueryState["data"];
  selectionState: Pick<QueryState, "nbSelected" | "selectAll" | "selected">;
}) {
  const { permissionValidator } = useGlobalConfig();
  return computed(() =>
    params.actions.value
      .map((action) => ({
        ...(action.icon && { icon: renderIcon(action.icon) }),
        label: action.link
          ? () => (
              <RouterLink to={action.link as RouteLocationRaw}>
                {action.label}
              </RouterLink>
            )
          : action.label,
        key: generateUUID(),
        props: {
          onClick: () =>
            action?.action?.({
              nbSelected: params.selectionState.nbSelected.value,
              selectAll: params.selectionState.selectAll.value,
              selected: params.selectionState.selected.value,
              fetchParams: params.fetchParams.value,
              tableApi: params.internalApi.value!,
            }),
        },
        _enable: computed(() =>
          typeof action.condition === "function"
            ? action.condition(
                Array.isArray(params.data.value) ? params.data.value : [],
                {
                  nbSelected: params.selectionState.nbSelected.value,
                  selectAll: params.selectionState.selectAll.value,
                  selected: params.selectionState.selected.value,
                  fetchParams: params.fetchParams.value,
                  tableApi: params.internalApi.value!,
                }
              )
            : true
        ),
        _allowed: computed(() =>
          action?.permissions?.length
            ? permissionValidator.value(action.permissions)
            : true
        ),
      }))
      .filter((action) => action._enable.value && action._allowed.value)
  );
}
