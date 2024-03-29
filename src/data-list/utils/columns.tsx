import { NTooltip } from 'naive-ui'
import type { DataTableColumn } from '../types/datatable'

// @ts-expect-error - Not resolved by TS ?
import MdiMagnify from '~icons/mdi/magnify'

// @ts-expect-error - Not resolved by TS ?
import MdiArrowUp from '~icons/mdi/arrow-up'

export const ColumnConfigDragTypes = {
  COLUMN: 'column',
}

export function renderColumnLabel(label: DataTableColumn['label']) {
  return (
    <div class="text-[12px] py-2 font-semibold">{ renderVNode(label) }</div>
  )
}

export function renderColumnIcons(options: { order: 'descend' | 'ascend' | false }, searchable: boolean, i18n: ReturnType<typeof useTranslations>) {
  return (
    <div class="flex items-center gap-0 text-sm mr-2">
      { searchable && (
        <NTooltip>
          {{
            default: () => i18n.t('datatable.searchQueryColumnIndicatorTooltip'),
            trigger: () => <MdiMagnify class=" !text-gray-500" />,
          }}
        </NTooltip>
      )}
      {
        options.order && (
          <MdiArrowUp
            class={` transform transition-all duration-100 ${options.order === 'descend' ? 'rotate-180' : ''} `}
          />
        )
      }
    </div>
  )
}
