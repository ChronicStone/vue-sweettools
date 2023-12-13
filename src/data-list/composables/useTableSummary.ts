import type { GenericObject } from '@/_shared/types/utils'

export function useTableSummary(params: {
  tableId: string
  data: Ref<GenericObject[]>
  columns: ReturnType<typeof useTableColumns>['columnDefs']
  scrollX: Ref<number>
}) {
  const summaryTableRef = ref<HTMLElement>()
  const { clonedElement, resync } = useElementClone(`#${params.tableId} > div > div > div.n-data-table-base-table-body.n-scrollbar > div.v-vl > div > table > colgroup`)
  const flattenedColsDef = computed(() => getDeepestCols(params.columns.value, false))
  const flattenedColsDefWithGrp = computed(() => getDeepestCols(params.columns.value, true))

  const columnGroupDef = computed(
    () => Array.from(clonedElement.value?.children ?? [])
      .map((col, colIndex) => ({
        style: col.getAttribute('style') ?? '',
        width: col.getAttribute('style')?.match(/width: (\d+)px/)?.[1] ?? '',
        column: flattenedColsDefWithGrp.value[colIndex],
      }))
      .filter(col => !('children' in col.column)),
  )

  const leftPinnedColMap = computed(() => {
    let currentX = 0
    const map = {} as Record<string, { start: number, end: number }>

    for (const colGroupItem of columnGroupDef.value) {
      if ('key' in colGroupItem.column && colGroupItem.column.fixed === 'left') {
        const width = Number.parseInt(colGroupItem.width, 10)
        map[colGroupItem.column.key] = {
          start: currentX,
          end: currentX + width,
        }
        currentX += width
      }
    }

    return map
  })

  const rightPinnedColMap = computed(() => {
    let currentX = 0
    const map = {} as Record<string, { start: number, end: number }>

    for (const colGroupItem of [...columnGroupDef.value].reverse()) {
      if ('key' in colGroupItem.column && colGroupItem.column.fixed === 'right') {
        const width = Number.parseInt(colGroupItem.width, 10)
        map[colGroupItem.column.key] = {
          start: currentX,
          end: currentX + width,
        }
        currentX += width
      }
    }

    return map
  })

  const fixedColLimitKey = computed(() => ({
    left: Object.keys(leftPinnedColMap.value).at(-1),
    right: Object.keys(rightPinnedColMap.value).at(-1),
  }))

  const nbSummaryRows = computed(() => flattenedColsDef.value.map(col => col.summary?.length ?? 0).reduce((acc, curr) => Math.max(acc, curr), 0))
  const summaryRows = computed(() => Array.from({ length: nbSummaryRows.value }, (_, i) => {
    return flattenedColsDef.value.map((col) => {
      const summary = col.summary?.[i]
      const value = typeof summary?.value === 'function' ? summary.value(params.data.value) : summary?.value
      return {
        key: 'key' in col ? col.key : col.type,
        value,
        colSpan: 1,
        rowSpan: col.summary?.[i]?.rowSpan ?? 1,
        fixed: col.fixed,
        fixedMeta: 'key' in col ? (col.fixed === 'left' ? leftPinnedColMap.value[col.key] : rightPinnedColMap.value[col.key]) : { start: 0, end: 0 },
      }
    })
  }))

  onMounted(async () => {
    while (!clonedElement.value) {
      resync()
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  })

  watch(params.scrollX, () => summaryTableRef.value?.scrollTo({ left: params.scrollX.value }))

  return {
    summaryRows,
    summaryTableRef,
    columnGroupDef,
    flattenedColsDef,
    leftPinnedColMap,
    rightPinnedColMap,
    fixedColLimitKey,
  }
}

export function getDeepestCols(
  columns: ReturnType<typeof useTableColumns>['columnDefs']['value'],
  includeGroupParents = true,
): Array<ReturnType<typeof useTableColumns>['columnDefs']['value'][number]> {
  return columns.reduce((acc, curr) => {
    if ('children' in curr) {
      return [
        ...acc,
        ...(includeGroupParents ? [{ ...curr }] : []),
        ...getDeepestCols(curr.children, includeGroupParents),
      ]
    }
    else { return [...acc, curr] }
  }, [] as Array<ReturnType<typeof useTableColumns>['columnDefs']['value'][number]>)
}
