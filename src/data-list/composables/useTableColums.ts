import type { DataTableColumn as TDataTableColumn } from 'naive-ui'
import { z } from 'zod'
import type { DataApi, DataResolverState, FullQueryState } from '../types/shared'
import type { DataTableColumn, DataTableColumnGroup } from '../types/datatable'

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
}) {
  const i18n = useTranslations()
  const columnConfig = ref(
    mapColumnsConfig(
      params.columns.value,
      params.persistency.value,
      params.tableKey.value,
      getPersistedColsConfig(params.persistency.value, params.tableKey.value),
    ).sort((a, b) => a.order - b.order),
  )

  const columnDefs = computed(() => {
    return [
      ...(params.selection.value
        ? [{ type: 'selection' } satisfies TDataTableColumn]
        : []),
      ...params.columns.value
        .filter(col => col?.condition?.() ?? true)
        .map(col => mapColumnsRecursively(col, columnConfig.value, { i18n, searchQuery: params.searchQuery.value }))
        .filter(col => col !== null)
        .sort((a, b) => {
          const aConfig = columnConfig.value.find(c => c.key === (a as any).key)?.order ?? 0
          const bConfig = columnConfig.value.find(c => c.key === (b as any).key)?.order ?? 0
          return aConfig - bConfig > 0 ? 1 : -1
        }),
    ]
  })

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

  return { columnDefs, columnConfig }
}

export function getFlatColumns(
  columns: Array<DataTableColumn | DataTableColumnGroup>,
  parent: string[] = [],
): Array<(DataTableColumn | DataTableColumnGroup) & { childOf: string[] }> {
  return columns.reduce((acc, curr) => {
    if ('children' in curr) {
      return [
        ...acc,
        { ...curr, childOf: [...parent, curr.key] },
        ...getFlatColumns(curr.children, [...parent, curr.key]),
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
  params: { i18n: ReturnType<typeof useTranslations>; searchQuery: string[] },
): TDataTableColumn {
  const config = colsConfig.find(c => c.key === column.key)
  if (!(config?.visible ?? true)) {
    // @ts-expect-error - Null columns are filtered out
    return null
  }
  if ('children' in column) {
    return {
      title: () => renderColumnLabel(column.label, true),
      key: column.key,
      children: column.children
        .filter(c => c?.condition?.() ?? true)
        .map(c => mapColumnsRecursively(c, config?.children ?? [], params))
        .filter(col => col !== null)
        .sort((a, b) => {
          const aConfig = config?.children.find(c => c.key === (a as any).key)
          const bConfig = config?.children.find(c => c.key === (b as any).key)

          return (aConfig?.order ?? 0) - (bConfig?.order ?? 0)
        }),
      resizable: column.resizable ?? true,
      renderSorterIcon: c => renderColumnIcons(c, false, params.i18n),
      fixed: !config?.fixed ? undefined : config?.fixed ?? column.fixed,
    } as TDataTableColumn
  }
  else {
    return {
      title: () => renderColumnLabel(column.label, true),
      key: `${column.key}`,
      width: column.width,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
      align: column.align,
      resizable: column.resizable ?? true,
      sorter: () => 0,
      ellipsis: column.ellipsis ?? true,
      ellipsisComponent: column.ellipsisComponent,
      render: (rowData, rowIndex) => column.render?.(rowData, rowIndex)
        ?? getObjectProperty(column.key, [], rowData)
        ?? '',
      cellProps: column.cellProps,
      colSpan: column.colSpan,
      rowSpan: column.rowSpan,
      fixed: !config?.fixed ? undefined : config?.fixed ?? column.fixed,
      renderSorterIcon: c => renderColumnIcons(c, params.searchQuery.includes(
        column.key,
      ), params.i18n),
    } satisfies TDataTableColumn
  }
}
