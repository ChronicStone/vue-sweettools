import { FetchParams, TableAction, TableApi } from "@/types/table";
import { GenericObject } from "@/types/utils";
import { generateUUID } from "@/utils/generateUUID";
import { renderIcon } from "@/utils/renderIcon";
import { ComputedRef, Ref } from "vue";
import { RouteLocationRaw, RouterLink } from "vue-router";

export function useDropdownActions(
  actions: ComputedRef<TableAction[]>,
  tableApi: Ref<TableApi | undefined>,
  fetchParams: Readonly<Ref<FetchParams>>,
  data: Ref<Record<string, any>[]>,
  selectionState: {
    nbSelected: Ref<number>;
    selectAll: Ref<boolean>;
    selected: Ref<GenericObject[]>;
  }
) {
  const { permissionValidator } = useGlobalConfig();
  return computed(() =>
    actions.value
      .filter(Boolean)
      .map((action: TableAction) => ({
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
              nbSelected: selectionState.nbSelected.value,
              selectAll: selectionState.selectAll.value,
              selected: selectionState.selected.value,
              fetchParams: fetchParams.value,
              tableApi: tableApi.value as TableApi,
            }),
        },
        _enable: computed(() =>
          typeof action.condition === "function"
            ? action.condition(data.value, {
                nbSelected: selectionState.nbSelected.value,
                selectAll: selectionState.selectAll.value,
                selected: selectionState.selected.value,
                fetchParams: fetchParams.value,
                tableApi: tableApi.value as TableApi,
              })
            : true
        ),
        _allowed: computed(() =>
          action?.permissions?.length
            ? permissionValidator.value(action.permissions)
            : true
        ),
        // usePermission(...(action?.permissions ?? [])),
      }))
      .filter((action) => action._enable.value && action._allowed.value)
  );
}
