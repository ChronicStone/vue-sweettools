import { type RouteLocationRaw, RouterLink } from 'vue-router'
import type { ComputedRef } from 'vue'
import type { Action, DataApi, FullQueryState } from '../types/shared'

export function useDataActions(params: {
  actions: ComputedRef<Action[]>
  internalApi: DataApi
  fetchParams: FullQueryState['fetchParams']
  data: FullQueryState['data']
  selectionState: Pick<FullQueryState, 'nbSelected' | 'selectAll' | 'selected'>
}) {
  const { permissionValidator } = useGlobalConfig()
  return computed(() =>
    params.actions.value
      .map(action => ({
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
              tableApi: params.internalApi,
            }),
        },
        _enable: computed(() =>
          typeof action.condition === 'function'
            ? action.condition(
              Array.isArray(params.data.value) ? params.data.value : [],
              {
                nbSelected: params.selectionState.nbSelected.value,
                selectAll: params.selectionState.selectAll.value,
                selected: params.selectionState.selected.value,
                fetchParams: params.fetchParams.value,
                tableApi: params.internalApi,
              },
            )
            : true,
        ),
        _allowed: computed(() =>
          action?.permissions?.length
            ? permissionValidator.value(action.permissions)
            : true,
        ),
      }))
      .filter(action => action._enable.value && action._allowed.value),
  )
}
