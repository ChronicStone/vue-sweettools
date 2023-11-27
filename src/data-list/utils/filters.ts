import type { VNodeChild } from 'vue'
import type { DynamicFilter } from '../types/shared'
import type { _FieldOptions } from '@/form/types/fields'

export function textFilter({
  key,
  label,
  matchMode,
}: {
  label: string | (() => VNodeChild)
  key: string
  matchMode: 'equals' | 'contains'
}): DynamicFilter {
  return {
    key,
    matchMode,
    type: 'text',
    label,
  }
}

export function selectFilter({
  key,
  label,
  options,
  multiple,
}: {
  label: string | (() => VNodeChild)
  key: string
  options: _FieldOptions
  multiple?: boolean
}): DynamicFilter {
  return {
    label,
    key,
    options,
    type: 'select',
    matchMode: 'equals',
    ...(multiple ? { arrayLookup: 'OR' } : {}),
  }
}

export function booleanFilter({
  key,
  label,
  options,
}: {
  key: string
  label: string | (() => VNodeChild)
  options?: {
    truthyValue?: boolean | number | string
    falsyValue?: boolean | number | string
  }
}): DynamicFilter {
  return {
    key,
    label,
    type: 'radio',
    matchMode: 'equals',
    default: undefined,
    options: [
      { label: 'Yes', value: options?.truthyValue ?? true },
      { label: 'No', value: options?.falsyValue ?? false },
      { label: 'All', value: undefined },
    ],
  }
}

export function booleanExistFilter({
  key,
  label,
}: {
  key: string
  label: string | (() => VNodeChild)
}): DynamicFilter {
  return {
    ...booleanFilter({ key, label }),
    matchMode: 'exists',
  }
}

export function timeRangeFilter({
  key,
  label,
}: {
  key: string
  label: string | (() => VNodeChild)
}): DynamicFilter {
  return {
    key,
    label,
    type: 'daterange',
    matchMode: 'between',
    params: { dateMode: true },
  }
}
