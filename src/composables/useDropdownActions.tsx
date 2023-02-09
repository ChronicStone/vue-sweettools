import { FetchParams, TableAction, TableApi } from "@/types/table";
import { GenericObject } from "@/types/utils";
import { generateUUID } from "@/utils/generateUUID";
import { renderIcon } from "@/utils/renderIcon";
import { GlobalThemeOverrides } from "naive-ui";
import { ComputedRef, Ref, computed, ref } from "vue";
import { RouteLocationRaw, RouterLink } from "vue-router";

export function useDropdownActions(
  actions: ComputedRef<TableAction[]>,
  tableApi: Ref<TableApi | undefined>,
  fetchParams: ComputedRef<FetchParams>,
  selectionState: {
    nbSelected: Ref<number>;
    selectAll: Ref<boolean>;
    selected: Ref<GenericObject[]>;
  }
) {
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
        _enable: ref(true), // usePermission(...(action?.permissions ?? [])),
      }))
      .filter((action: { _enable: Ref<boolean> }) => action._enable.value)
  );
}
