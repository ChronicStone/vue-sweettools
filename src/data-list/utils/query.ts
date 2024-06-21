import type { DynamicFilter, MappedFilters, QuickFilter, StaticFilter } from '../types/shared'
import type { GenericObject } from '@/_shared/types/utils'

export function getFilterInitialState() {

}

export function mapFilterInitialState(
  filters: DynamicFilter[],
  baseState: GenericObject,
  clearMode = false,
): GenericObject {
  const GetInitState = (type: DynamicFilter['type'], defaultValue: any) => typeof defaultValue != 'undefined'
    ? defaultValue
    : ['select', 'checkboxGroup'].includes(type)
        ? []
        : ['daterange', 'datetimerange', 'monthrange'].includes(type)
            ? [null, null]
            : type === 'radio' ? undefined : null
  const state: { [key: string]: any } = {}
  filters.filter(Boolean).forEach((filter) => {
    baseState[filter.key] && !clearMode
      ? (state[filter.key] = baseState[filter.key])
      : (state[filter.key] = GetInitState(
          (filter as any).inputType,
          (filter as any).default,
        ))
  })
  return state
}

export function mapQuickFilterInitialState(
  filters: QuickFilter[],
  baseState: GenericObject,
  clearMode = false,
): GenericObject {
  const _filters = filters.filter(f => f.condition?.() ?? true)
  const state: { [key: string]: any } = {}
  _filters.forEach((filter) => {
    console.log(filter.key, filter)
    baseState[filter.key] && !clearMode
      ? (state[filter.key] = baseState[filter.key])
      : (state[filter.key] = filter.default ?? (filter.multiple ? [] : undefined))
  })

  return state
}

export function mapQueryFetchParams(
  filterState: { panelFilters: GenericObject; quickFilters: GenericObject },
  panelFilters: DynamicFilter[],
  staticFilters: StaticFilter[],
  quickFilters: QuickFilter[],
) {
  const mappedFilters = pipeMergeObject(
    mapStaticFilters(staticFilters),
    mapTableFilters(panelFilters, filterState.panelFilters),
    mapQuickFilters(quickFilters, filterState.quickFilters),
  )

  return Object.keys(mappedFilters).length > 0 ? mappedFilters : null
}

function mapStaticFilters(filters: StaticFilter[]) {
  return (filters || {}).reduce(
    (acc, { key, value, matchMode, required, params, postCondition, arrayLookup, lookupAtRoot }) => ({
      ...acc,
      [key]: [
        ...(acc?.[key] ?? []),
        {
          value,
          matchMode,
          required: required ?? false,
          params: params ?? {} as any,
          postCondition,
          arrayLookup,
          lookupAtRoot,
        },
      ],
    }),
    {} as Record<string, MappedFilters[]>,
  )
}

export function mapTableFilters(
  filters: DynamicFilter[],
  filterState: GenericObject,
) {
  return Object.entries(filterState || {}).reduce((acc, [key, value]) => {
    const filter = filters.find(filter => filter.key === key)
    if (
      !filter
      || (Array.isArray(value) && !value.length)
      || (!Array.isArray(value) && (typeof value === 'undefined' || value === null))
    )
      return acc
    return {
      ...acc,
      [key]: [
        {
          matchMode: filter?.matchMode ?? 'equals',
          required: false,
          params: filter?.params ?? {} as any,
          value,
          postCondition: filter?.postCondition ?? false,
          arrayLookup: filter?.arrayLookup,
          lookupAtRoot: filter?.lookupAtRoot,
        },
      ],
    }
  }, {} as Record<string, MappedFilters[]>)
}

export function mapQuickFilters(
  filters: QuickFilter[],
  filterState: GenericObject,
) {
  return Object.entries(filterState || {}).reduce<Record<string, MappedFilters[]>>((acc, [key, value]) => {
    const filter = filters.find(filter => filter.key === key)
    if (
      !filter
      || (Array.isArray(value) && !value.length)
      || (!Array.isArray(value) && (typeof value === 'undefined' || value === null))
    )
      return acc
    return {
      ...acc,
      [key]: [
        {
          matchMode: filter?.matchMode ?? 'equals',
          required: false,
          value: typeof filter.transform === 'function' ? filter.transform(value) : value,
          postCondition: false,
        },
      ],
    }
  }, {} as Record<string, MappedFilters[]>)
}
