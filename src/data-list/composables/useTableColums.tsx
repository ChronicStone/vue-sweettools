import { z } from 'zod'
import { NButton } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { DataApi, DataResolverState, FullQueryState, RowAction } from '../types/shared'
import type { DataTableColumn, DataTableColumnGroup, DataTableSchema, TDataTableColumn } from '../types/datatable'
import RowActions from '../content/RowActions.vue'

const BASE_CONF_CONF_SCHEMA = z.object({
  label: z.union([z.string(), z.function()]).optional(),
  key: z.string(),
  fixed: z.union([z.literal('left'), z.literal('right')]).optional(),
  visible: z.boolean(),
  condition: z.function().optional(),
  order: z.number(),
})
type BaseColConf = z.infer<typeof BASE_CONF_CONF_SCHEMA> & {
  children: BaseColConf[]
}
const COL_CONF_SCHEMA: z.ZodType<BaseColConf> = BASE_CONF_CONF_SCHEMA.extend({
  children: z.lazy(() => z.array(COL_CONF_SCHEMA)),
})
export const RUNTIME_COLS_CONFIG_SCHEMA = z.array(COL_CONF_SCHEMA)
export type RuntimeColsConfig = z.infer<typeof RUNTIME_COLS_CONFIG_SCHEMA>

export function useTableColumns(params: {
  selection: ComputedRef<boolean>
  remote: ComputedRef<boolean>
  columns: ComputedRef<Array<DataTableColumn | DataTableColumnGroup>>
  queryState: FullQueryState
  resolver: DataResolverState
  dataApi: DataApi
  persistency: ComputedRef<false | 'localStorage' | 'sessionStorage'>
  tableKey: ComputedRef<string>
  searchQuery: ComputedRef<string[]>
  data: FullQueryState['data']
  sortState: FullQueryState['sortState']
  rowActions: ComputedRef<RowAction[]>
  expandable: ComputedRef<DataTableSchema['expandable']>
  expandedContent: ComputedRef<DataTableSchema['expandedContent']>
  draggable: ComputedRef<boolean>
}) {
  const i18n = useTranslations()
  const columnConfig = ref(
    mapColumnsConfig(
      params.columns.value,
      params.persistency.value,
      params.tableKey.value,
      getPersistedColsConfig(params.persistency.value, params.tableKey.value),
    ).sort(sortCols),
  )

  const { rowsActions, hasActiveRowActions, maxRowActions } = useTableRowActions({ data: params.data, api: params.dataApi, actions: params.rowActions })

  const columnDefs = computed(() => [
    ...(params.draggable.value
      ? [
          {
            width: 40,
            key: '#internal__dragHandle',
            render: () => (
              <NButton text disabled={!!params.sortState.value.key} class={`drag-handle ${!params.sortState.value.key && 'cursor-move'}`}>
                {{ icon: () => <span class="iconify" data-icon="material-symbols:drag-handle-rounded" /> }}
              </NButton>
            ),

          },
        ]
      : []),
    ...(params.selection.value
      ? [{ type: 'selection' } satisfies TDataTableColumn]
      : []),
    ...(params.expandedContent.value
      ? [
        {
          type: 'expand',
          expandable: rowData => params.expandable?.value?.({ rowData, tableApi: params.dataApi }) ?? true,
          renderExpand: rowData => params.expandedContent.value?.({ rowData, tableApi: params.dataApi }) ?? '',
        } satisfies TDataTableColumn,
        ]
      : []),
    ...(hasActiveRowActions.value
      ? [
        {
          title: () => renderColumnLabel('Actions'),
          key: '#internal__actions',
          sorter: false,
          // @ts-expect-error - Weird inference issue ??
          render: (rowData, rowIndex) => <RowActions actions={rowsActions.value?.[rowIndex]?.actions ?? []} row-data={rowData} api={params.dataApi} />,
          width: maxRowActions.value * 30 + (maxRowActions.value < 3 ? (90 - maxRowActions.value * 30) : 0) + 16,
          resizable: true,
        },
      ] satisfies TDataTableColumn[]
      : []),
    ...params.columns.value
      .filter(col => col?.condition?.() ?? true)
      .map(col => mapColumnsRecursively(col, columnConfig.value, { i18n, searchQuery: params.searchQuery.value }))
      .filter(col => col !== null)
      .sort((a, b) => {
        const aConfig = columnConfig.value.find(c => c.key === (a as any).key)!
        const bConfig = columnConfig.value.find(c => c.key === (b as any).key)!
        return sortCols(aConfig, bConfig)
      }),
  ])

  function resetColumnsConfig() {
    columnConfig.value = mapColumnsConfig(
      params.columns.value,
      params.persistency.value,
      params.tableKey.value,
      null,
    ).sort(sortCols)
  }

  watch(
    () => columnConfig.value,
    (config) => {
      if (!params.persistency.value)
        return
      const target
        = params.persistency.value === 'localStorage'
          ? localStorage
          : sessionStorage

      target.setItem(
        `${params.tableKey.value}__#columnsConfig`,
        JSON.stringify(config),
      )
    },
    { deep: true },
  )

  return { columnDefs, columnConfig, hasActiveRowActions, resetColumnsConfig }
}

export function getFlatColumns(
  columns: Array<DataTableColumn | DataTableColumnGroup>,
  parent: string[] = [],
  includeGroupParents = true,
): Array<(DataTableColumn | DataTableColumnGroup) & { childOf: string[] }> {
  return columns.reduce((acc, curr) => {
    if ('children' in curr) {
      return [
        ...acc,
        ...(includeGroupParents ? [{ ...curr, childOf: [...parent, curr.key] }] : []),
        ...getFlatColumns(curr.children, [...parent, curr.key], includeGroupParents),
      ]
    }
    else { return [...acc, { ...curr, childOf: parent }] }
  }, [] as Array<(DataTableColumn | DataTableColumnGroup) & { childOf: string[] }>)
}

export function mapColumnsConfig(
  columns: Array<DataTableColumn | DataTableColumnGroup>,
  persistency: false | 'localStorage' | 'sessionStorage',
  tableKey: string,
  persistedConfig: RuntimeColsConfig | null,
): RuntimeColsConfig {
  return columns.map((col, index) => {
    const persistedCol = persistedConfig?.find(c => c.key === col.key)
    if (!persistency || !persistedConfig) {
      return {
        label: col.label,
        key: col.key,
        fixed: col.fixed ?? undefined,
        visible: true,
        condition: col.condition,
        order: index,
        children:
          'children' in col
            ? mapColumnsConfig(
              col.children,
              persistency,
              tableKey,
              persistedCol?.children ?? null,
            ).sort((a, b) => a.order - b.order)
            : [],
      }
    }
    return {
      label: col.label,
      key: col.key,
      fixed: persistedCol?.fixed ?? col.fixed ?? undefined,
      visible: persistedCol?.visible ?? true,
      condition: col.condition,
      order: persistedCol?.order ?? index,
      children:
        'children' in col
          ? mapColumnsConfig(
            col.children,
            persistency,
            tableKey,
            persistedCol?.children ?? null,
          ).sort((a, b) => a.order - b.order)
          : [],
    }
  }) as RuntimeColsConfig
}

function getPersistedColsConfig(
  source: 'localStorage' | 'sessionStorage' | false,
  tableKey: string,
) {
  if (!source)
    return null
  const persistedColsConfig = (
    source === 'localStorage' ? localStorage : sessionStorage
  ).getItem(`${tableKey}__#columnsConfig`)
  if (!persistedColsConfig)
    return null
  try {
    const result = RUNTIME_COLS_CONFIG_SCHEMA.safeParse(
      JSON.parse(persistedColsConfig),
    )
    if (!result.success)
      return null

    else return result.data
  }
  catch (e) {
    console.error('Failed to parse persisted columns config', e)
    return null
  }
}

function mapColumnsRecursively(
  column: DataTableColumn | DataTableColumnGroup,
  colsConfig: ReturnType<typeof mapColumnsConfig>,
  params: { i18n: ReturnType<typeof useTranslations>, searchQuery: string[] },
): TDataTableColumn {
  const config = colsConfig.find(c => c.key === column.key)
  if (!(config?.visible ?? true)) {
    // @ts-expect-error - Null columns are filtered out
    return null
  }
  if ('children' in column) {
    return {
      title: () => renderColumnLabel(column.label),
      key: column.key,
      children: column.children
        .filter(c => c?.condition?.() ?? true)
        .map(c => mapColumnsRecursively(c, config?.children ?? [], params))
        .filter(col => col !== null)
        .sort((a, b) => {
          const aConfig = config?.children.find(c => c.key === (a as any).key)
          const bConfig = config?.children.find(c => c.key === (b as any).key)

          return sortCols(aConfig!, bConfig!)
        }),
      resizable: column.resizable ?? true,
      renderSorterIcon: c => renderColumnIcons(c, false, params.i18n),
      fixed: !config?.fixed ? undefined : config?.fixed ?? column.fixed,
    } as TDataTableColumn
  }
  else {
    return {
      title: () => renderColumnLabel(column.label),
      key: `${column.key}`,
      width: column.width ?? 200,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
      align: column.align,
      resizable: column.resizable ?? true,
      sorter: () => 0,
      ellipsis: column.ellipsis ?? true,
      ellipsisComponent: column.ellipsisComponent,
      render: (rowData, rowIndex) => column.render?.(rowData, rowIndex)
      ?? getObjectProperty({
        key: column.key,
        object: rowData,
        scoped: false,
      })
      ?? '',
      cellProps: column.cellProps,
      colSpan: column.colSpan,
      rowSpan: column.rowSpan,
      fixed: !config?.fixed ? undefined : config?.fixed ?? column.fixed,
      renderSorterIcon: c => renderColumnIcons(c, params.searchQuery.includes(
        column.key,
      ), params.i18n),
      summary: column.summary,
    } satisfies TDataTableColumn
  }
}

export function sortCols(a: BaseColConf, b: BaseColConf) {
  if (a.fixed === 'left' && b.fixed !== 'left')
    return -1
  if (a.fixed !== 'left' && b.fixed === 'left')
    return 1
  if (a.fixed === 'right' && b.fixed !== 'right')
    return 1
  if (a.fixed !== 'right' && b.fixed === 'right')
    return -1
  if (a.fixed === 'left' && b.fixed === 'left')
    return a.order - b.order
  if (a.fixed === 'right' && b.fixed === 'right')
    return a.order - b.order
  return a.order - b.order
}
