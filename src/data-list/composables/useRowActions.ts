import type { ComputedRef } from 'vue'
import type { DataApi, FullQueryState, RowAction } from '../types/shared'

export function useTableRowActions(params: {
  actions: ComputedRef<RowAction[]>
  data: FullQueryState['data']
  api: DataApi
}) {
  const { permissionValidator } = useGlobalConfig()
  const rowsActions = computed(() => params.data.value.map(row => ({
    key: row.__$ROW_ID__,
    actions: params.actions.value.map(action => ({
      ...action,
      icon:
        typeof action.icon === 'function'
          ? action.icon({ rowData: row })
          : action.icon,
      label:
        typeof action.label === 'function'
          ? action.label({ rowData: row })
          : action.label,
      ...(action.link && {
        link:
          typeof action.link === 'function'
            ? action.link({ rowData: row })
            : action.link,
      }),
      handler: () => {},
      _enable:
          typeof action.condition === 'function'
            ? action.condition(
              {
                rowData: row,
                tableApi: params.api,
              },
            )
            : true,
      _allowed:
          action?.permissions?.length
            ? permissionValidator.value(action.permissions)
            : true,
    }))
      .filter(action => action._enable && action._allowed),
  })))

  const hasActiveRowActions = computed(() => rowsActions.value.some(row => row.actions.length))
  const maxRowActions = computed(() => Math.max(...rowsActions.value.map(row => row.actions.length)))

  return {
    rowsActions,
    maxRowActions,
    hasActiveRowActions,
  }
}
