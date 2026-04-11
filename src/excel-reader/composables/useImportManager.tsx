import type { DataTableColumn } from 'naive-ui'
import { NDataTable, NPopover, NTag } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
import type { ImportSchema, ImportSchemaField, PrimitiveValue } from '../types/reader'
import type { Primitive } from '@/_shared/types/utils'

const MULTIPLE_SEPARATOR_DEFAULT = ','
type GenericObject = Record<Primitive, any>

interface ImportManagerParams {
  fields: ComputedRef<ImportSchema['fields']>
  fieldOptions: Ref<Array<{ key: string; enum: PrimitiveValue[] }>>
}

export function useImportManager({ fields, fieldOptions }: ImportManagerParams) {
  const i18n = useTranslations()
  const searchQuery = ref<string>('')
  const rawData = ref<Record<string, string>[]>([])
  const data = computed(() =>
    rawData.value.map(row => formatRow(fields.value, row)),
  )

  const filteredRows = computed<Record<string, unknown>[]>(() =>
    data.value
      .sort(
        (a, b) => +validateRow(fields.value, a, fieldOptions.value) - +validateRow(fields.value, b, fieldOptions.value),
      )
      .filter((row) => {
        if (!searchQuery.value)
          return true
        for (const key in row) {
          if (
            row[key]
            && row[key]
              .toString()
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
          )
            return true
        }
        return false
      }),
  )

  const invalidRows = computed(() =>
    filteredRows.value.filter(row => !validateRow(fields.value, row, fieldOptions.value)),
  )
  const validRows = computed(() =>
    filteredRows.value.filter(row => validateRow(fields.value, row, fieldOptions.value)),
  )

  const tableColumns = computed(
    () =>
      [
        {
          title: () => (
            <NTag type="primary" class="uppercase">
              {i18n.t('excelImport.isValidTag')}
            </NTag>
          ),
          key: '__isValid',
          render: (row: Record<string, unknown>) =>
            renderBoolean(validateRow(fields.value, row, fieldOptions.value)),
        },
        ...fields.value.map(field => ({
          title: () => (
            <span>
              {field?.label ?? field.key}
              {' '}
              {field.required && <span class="text-red-500">*</span>}
            </span>
          ),
          key: field?.transformKey ?? field.key,
          render: getCellRenderer(
            field?.transformKey ?? (field.key as string),
            field,
            i18n,
            fieldOptions.value,
          ),
          sorter: 'default',
        })),
      ] as DataTableColumn[],
  )

  const pagination = reactive({
    page: 1,
    pageSize: 50,
    pageSizes: [50, 100, 250, 500],
    showSizePicker: true,
    onUpdatePageSize(pageSize: number) {
      this.pageSize = pageSize
    },
    onChange(page: number) {
      this.page = page
    },
    prefix() {
      return (
        <div>
          {pagination.pageSize * pagination.page - (pagination.pageSize - 1)}
          {' '}
          -
          {' '}
          {pagination.pageSize * pagination.page}
          {' '}
          of
          {' '}
          {filteredRows.value?.length}
        </div>
      )
    },
  })

  return {
    searchQuery,
    rawData,
    data,
    filteredRows,
    validRows,
    invalidRows,
    pagination,
    tableColumns,
  }
}

function validateField(value: any, field: ImportSchemaField, fieldOptions: Array<{ key: string; enum: PrimitiveValue[] }>) {
  if (!value && !field.required)
    return true
  if (
    field?.required
    && (!value || (Array.isArray(value) && !value.length))
  )
    return false
  if (
    field?.matchPattern
    && !new RegExp(field?.matchPattern).test(value?.toString() ?? '')
  ) {
    return field?.multiple && Array.isArray(value)
      ? value.every(v => new RegExp(field?.matchPattern as RegExp).test(v))
      : new RegExp(field?.matchPattern as RegExp).test(
        value?.toString() ?? '',
      )
  }

  if (field?.enum) {
    if (!field?.required && !value) { return true }
    else {
      const _enum = fieldOptions.find(option => option.key === field.key)?.enum ?? []
      const mappedEnum = _enum.map(enumItem =>
        field?.caseInsensitive
          ? enumItem?.toString()?.toLocaleLowerCase()
          : enumItem,
      )
      const mappedValue
        = field.multiple && Array.isArray(value)
          ? value.map(v =>
            field?.caseInsensitive
              ? v?.toString()?.toLocaleLowerCase()
              : v,
          )
          : field?.caseInsensitive
            ? value?.toString()?.toLocaleLowerCase()
            : value

      return field.multiple && Array.isArray(value)
        ? (mappedValue as string[]).every(v =>
            mappedEnum.includes(
              field?.caseInsensitive
                ? v?.toString?.()?.toLocaleLowerCase?.()
                : v,
            ),
          )
        : mappedEnum.includes(
          field?.caseInsensitive
            ? value?.toString?.()?.toLocaleLowerCase?.() ?? ''
            : value,
        )
    }
  }
  return true
}

function validateRow(
  _fields: ImportSchemaField[],
  row: Record<string, unknown>,
  fieldOptions: Array<{ key: string; enum: PrimitiveValue[] }>,
) {
  return _fields.every(field =>
    validateField(row[field?.transformKey ?? field.key], field, fieldOptions),
  )
}

function formatRowKeys(row: Record<string, string>) {
  return Object.entries(row).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key.replace('(*)', '').replace(/ +/g, '')]: value,
    }),
    {} as Record<string, string>,
  )
}

function formatRow(_fields: ImportSchemaField[], row: Record<string, string>) {
  const _row = formatRowKeys(row)
  return _fields.reduce((acc, field) => {
    if (field?.multiple) {
      const value = _row[field.key]
      if (value) {
        const multipleValues = value
          ?.toString()
          ?.split(field?.multipleSeparator ?? MULTIPLE_SEPARATOR_DEFAULT)
        return {
          ...acc,
          [field?.transformKey ?? field.key]: multipleValues
            .map((value: string) => value.trim())
            .map((value: string) => formatField(value, field?.format)),
        }
      }
      else { return { ...acc, [field?.transformKey ?? field.key]: null } }
    }

    return {
      ...acc,
      [field?.transformKey ?? field.key]: transformField(formatField(
        _row[field.key],
        field.format,
      ), field.transform),
    }
  }, {} as GenericObject)

  function transformField(value: PrimitiveValue, transform: ImportSchemaField['transform']) {
    if (!transform)
      return value
    return transform(value)
  }

  function formatField(
    value: string,
    format: ImportSchemaField['format'],
  ) {
    let updated: unknown = value
    if (!format)
      return value

    format.forEach((format) => {
      if (format === 'trim')
        updated = updated?.toString?.().trim()
      if (format === 'lowercase')
        updated = updated?.toString?.().toLocaleLowerCase()
      if (format === 'uppercase')
        updated = updated?.toString?.().toLocaleUpperCase()
      if (format === 'number')
        updated = Number(updated)
      if (format === 'date')
        updated = new Date(updated?.toString() ?? '')
    })

    return updated as PrimitiveValue
  }
}

export function renderBoolean(value: boolean) {
  return (
    <span
      class={`iconify ${value ? 'text-green-500' : 'text-red-500'}`}
      data-icon={value ? 'mdi:check' : 'mdi:close'}
    />
  )
}

export function getCellRenderer(
  key: string,
  field: ImportSchemaField,
  i18n: ReturnType<typeof useTranslations>,
  fieldOptions: Array<{ key: string; enum: PrimitiveValue[] }>,
) {
  if (typeof field?.cellRenderer === 'function')
    return field.cellRenderer
  if (field?.multiple)
    return multiCellRenderer(key, field, i18n, fieldOptions)
  return defaultCellRenderer(key, field, i18n, fieldOptions)
}

export function rowValidityRenderer(isValid: boolean) {
  return (
    <div class={isValid ? 'text-green-500' : 'text-red-500'}>
      {isValid ? '✔' : '✖'}
    </div>
  )
}

export function defaultCellRenderer(
  key: string,
  schema: ImportSchemaField,
  i18n: ReturnType<typeof useTranslations>,
  fieldOptions: Array<{ key: string; enum: PrimitiveValue[] }>,
) {
  return (row: Record<string, unknown>) => {
    const isFieldValid = validateField(row[key], schema, fieldOptions)
    if (schema.required && !row[key]) {
      return (
        <div class="text-red-500 uppercase">
          {i18n.t('excelImport.missingValue')}
        </div>
      )
    }
    return <div class={isFieldValid ? '' : 'text-red-500'}>{row[key]}</div>
  }
}

export function multiCellRenderer(
  key: string,
  schema: ImportSchemaField,
  i18n: ReturnType<typeof useTranslations>,
  fieldOptions: Array<{ key: string; enum: PrimitiveValue[] }>,
) {
  return (row: Record<string, Array<unknown>>) => {
    if (schema.required && !row[key]?.length)
      return <div class="text-red-500">MISSING VALUE</div>
    else if (!row[key]?.length)
      return <div></div>

    const mappedItems = row[key].map(item => ({
      value: item,
      __isValid: validateField(item, { ...schema, multiple: false }, fieldOptions),
    }))
    const columns: DataTableColumn<{ __isValid: boolean }>[] = [
      { title: () => i18n.t('excelImport.value'), key: 'value' },
      {
        title: () => (
          <NTag type="primary" class="uppercase">
            {i18n.t('excelImport.isValidTag')}
          </NTag>
        ),
        key: '__valid',
        render: row => renderBoolean(row.__isValid),
      },
    ]

    return (
      <NPopover width={400} style="padding: 0;">
        {{
          default: () => (
            <NDataTable
              maxHeight={150}
              data={mappedItems}
              columns={columns}
            >
            </NDataTable>
          ),
          trigger: () => (
            <div
              class={`flex items-center gap-2 ${
                mappedItems.some(
                  (item: { __isValid: boolean }) => !item.__isValid,
                )
                  ? 'text-red-500'
                  : ''
              }`}
            >
              {row[key].length}
              <span class="iconify" data-icon="mdi:eye"></span>
            </div>
          ),
        }}
      </NPopover>
    )
  }
}
