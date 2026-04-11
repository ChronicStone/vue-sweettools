import { type RouteLocationRaw, RouterLink } from 'vue-router'
import type { ComputedRef } from 'vue'
import type { DropdownOption } from 'naive-ui'
import type { Action, ActionGroup, DataApi, FullQueryState } from '../types/shared'

export function useDataActions(params: {
  actions: ComputedRef<Action[] | ActionGroup[]>
  internalApi: DataApi
  fetchParams: FullQueryState['fetchParams']
  data: FullQueryState['data']
  selectionState: Pick<FullQueryState, 'nbSelected' | 'selectAll' | 'selected'>
}) {
  const { permissionValidator } = useGlobalConfig()

  function isActionEnabled(action: Action | ActionGroup) {
    return typeof action.condition === 'function'
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
      : true
  }

  function isActionAuthorized(action: Action | ActionGroup) {
    return action?.permissions?.length
      ? permissionValidator.value(action.permissions)
      : true
  }

  function buildMenuItems(actions: Array<Action | ActionGroup>): Array<DropdownOption> {
    return actions.map((action) => {
      if ('children' in action && action.children) {
        return {
          key: generateUUID(),
          label: action.label,
          children: buildMenuItems(action.children),
          ...(action.icon && { icon: renderIcon(action.icon) }),
          show: isActionEnabled(action) && isActionAuthorized(action),
        }
      }
      else if (!('children' in action)) {
        return {
          ...(action.icon && { icon: renderIcon(action.icon) }),
          key: generateUUID(),
          label: action.link
            ? () => (
              <RouterLink to={action.link as RouteLocationRaw}>
                {action.label}
              </RouterLink>
              )
            : action.label,
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
          show: isActionEnabled(action) && isActionAuthorized(action),

        }
      }
      else { throw new Error('Invalid action') }
    }).filter(action => action.show)
  }
  return computed(() => buildMenuItems(params.actions.value))
}
