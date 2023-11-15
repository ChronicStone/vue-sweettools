import type { DynamicFilter, MappedFilters, StaticFilter } from '../types/shared'
import type { GenericObject } from '@/_shared/types/utils'

export function mapFilterInitialState(
  filters: DynamicFilter[],
  baseState: GenericObject,
  clearMode = false,
): GenericObject {
  const GetInitState = (type: DynamicFilter['type'], defaultValue: any) => typeof defaultValue != 'undefined'
    ? defaultValue
    : ['select', 'checkboxGroup'].includes(type)
        ? []
        : ['daterange', 'datetimerange'].includes(type)
            ? [null, null]
            : null
  const state: { [key: string]: any } = {}
  filters.filter(Boolean).forEach((filter) => {
    baseState[filter.key] && !clearMode
      ? (state[filter.key] = baseState[filter.key])
      : (state[filter.key] = GetInitState(
          (filter as any).inputType,
          (filter as any).defaultValue,
        ))
  })
  return state
}

export function mapQueryFetchParams(
  filterState: GenericObject,
  panelFilters: DynamicFilter[],
  staticFilters: StaticFilter[],
) {
  const mappedFilters = pipeMergeObject(
    mapStaticFilters(staticFilters),
    mapTableFilters(panelFilters, filterState),
  )

  return Object.keys(mappedFilters).length > 0 ? mappedFilters : null
}

function mapStaticFilters(filters: StaticFilter[]) {
  return filters.reduce(
    (acc, { key, value, matchMode, required, params, postCondition }) => ({
      ...acc,
      [key]: [
        ...(acc?.[key] ?? []),
        {
          value,
          matchMode,
          required: required ?? false,
          params: params ?? {},
          postCondition,
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
  const getDefaultMatchMode = (value: any) =>
    Array.isArray(value) ? 'arrayContains' : 'contains'

  return Object.entries(filterState).reduce((acc, [key, value]) => {
    const filter = filters.find(filter => filter.key === key)
    if (
      !filter
        || (Array.isArray(value) && !value.length)
        || (!Array.isArray(value) && !value)
    )
      return acc
    return {
      ...acc,
      [key]: [
        {
          matchMode: filter?.matchMode ?? getDefaultMatchMode(value),
          required: false,
          params: filter?.params ?? {},
          value,
          postCondition: filter?.postCondition ?? false,
        },
      ],
    }
  }, {} as Record<string, MappedFilters[]>)
}
