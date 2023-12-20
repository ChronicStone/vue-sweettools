import type { NDataTable } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
import { useDraggable } from 'vue-draggable-plus'
import type { FullQueryState } from '../types/shared'
import type { DataTableSchema } from '../types/datatable'

export function useTableDrag(params: {
  draggable: ComputedRef<boolean>
  tableRef: Ref<InstanceType<typeof NDataTable> | undefined>
  data: FullQueryState['data']
  onRowDrag: ComputedRef<DataTableSchema['onRowDrag']>
  columnsConfig: ReturnType<typeof useTableColumns>['columnConfig']
  columnsDef: ReturnType<typeof useTableColumns>['columnDefs']
  sortState: FullQueryState['sortState']
  localStore: ReturnType<typeof useDataResolver>['localDataStore']
  selection: ComputedRef<boolean>
  hasRowActions: ComputedRef<boolean>
}) {
  const tableEl = computed(() => params.tableRef?.value?.$el as HTMLElement)
  const tableBodyRef = ref<HTMLElement | undefined>(undefined)
  const tableHeaderRef = ref<HTMLElement | undefined>(undefined)

  const nbInternalCols = computed(() => [
    params.hasRowActions.value,
    params.selection.value,
    params.draggable.value,
  ].filter(item => item).length)

  const { start: startDragRow, pause: pauseRowDrag, resume: resumeRowDrag } = useDraggable(tableBodyRef, ref([]), {
    immediate: false,
    animation: 150,
    handle: '.drag-handle',
    onEnd: (event) => {
      const oldIndex = Number.parseInt(event.item.dataset.rowIndex ?? '0')
      const newIndex = oldIndex + ((event?.newIndex ?? 0) - (event?.oldIndex ?? 0))
      const start = Math.min(oldIndex!, newIndex!)
      const range = Math.max(oldIndex!, newIndex!) - start + 1
      const changedRows = [...params.data.value].splice(start, range)
      const targetRows = [...changedRows]

      const draggedRow = changedRows.splice(oldIndex! - start, 1)[0]
      changedRows.splice(newIndex! - start, 0, draggedRow)
      for (let index = start; index < start + range; index++)
        params.data.value[index] = changedRows[index - start]

      params.onRowDrag.value?.(unref([...changedRows]))

      const storeStartIndex = params.localStore.value.findIndex(row => row.__$ROW_ID__ === targetRows[0].__$ROW_ID__)
      for (let index = 0; index < changedRows.length; index++)
        params.localStore.value[storeStartIndex + index] = changedRows[index]
    },
  })

  const visibleColumns = computed({
    get: () => [
      ...Array(nbInternalCols.value).fill({}).map((_, index) => ({
        key: `#internal__offset-column-${index}`,
        order: index,
        visible: false,
      })),
      ...params.columnsConfig.value.filter(col => col.visible).sort((a, b) => a.order - b.order),
    ],
    set: (reorderedColumns) => {
      const totalOffset = nbInternalCols.value + params.columnsConfig.value.filter(col => col.visible && col.fixed === 'left').length
      const updatedColumns = reorderedColumns
        .filter(col => !col?.key.startsWith('#internal__offset-column-'))
      const orderMap = new Map(updatedColumns.map((col, index) => [col?.key, index + totalOffset]))
      params.columnsConfig.value.filter(col => !col.fixed).forEach((col) => {
        if (orderMap.has(col?.key))
          col.order = orderMap.get(col?.key) as number
      })

      params.columnsConfig.value = [...params.columnsConfig.value].sort((a, b) => a.order - b.order)
    },
  })

  const { start: startColDrag } = useDraggable(tableHeaderRef, visibleColumns, {
    immediate: false,
    animation: 150,
    filter: (_, el) => {
      const key = el.dataset.colKey ?? ''
      if (['#internal__dragHandle', '#internal__actions', '__n_selection__'].includes(key) || el.getAttribute('style')?.trim().includes('px'))
        return true

      return false
    },
  })

  onMounted(async () => {
    while (!tableBodyRef.value || !tableHeaderRef.value) {
      if (!tableBodyRef.value)
        tableBodyRef.value = tableEl.value?.querySelector('tbody') || undefined
      if (!tableHeaderRef.value)
        tableHeaderRef.value = tableEl.value?.querySelector('thead > tr') as HTMLElement || undefined
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  })

  watchOnce(() => tableBodyRef.value, (el) => {
    if (el && params.draggable.value)
      startDragRow()
    if (params.sortState.value.key)
      pauseRowDrag()
  })

  watchOnce(() => tableHeaderRef.value, (el) => {
    if (el)
      startColDrag()
  })

  watch(() => params.sortState.value.key, hasSort => hasSort ? pauseRowDrag() : resumeRowDrag(), { immediate: true })
}
