import { z } from 'zod'
import type { ComparatorParams, DataSource, FetchParams, FilterMatchMode, ObjectMapFilterParams } from '../types/shared'
import type { GenericObject } from '@/_shared/types/utils'

type T_MATCH_MODE_PROCESSOR = {
  equals: ({ value, filter }: { value: any; filter: any }) => boolean
  notEquals: ({ value, filter }: { value: any; filter: any }) => boolean
  exists: ({ value, filter }: { value: any; filter: any }) => boolean
  contains: ({ value, filter }: { value: any; filter: any }) => boolean
  greaterThan: ({ value, filter }: { value: any; filter: any; params?: ComparatorParams }) => boolean
  greaterThanOrEqual: ({ value, filter }: { value: any; filter: any; params?: ComparatorParams }) => boolean
  lessThan: ({ value, filter }: { value: any; filter: any; params?: ComparatorParams }) => boolean
  lessThanOrEqual: ({ value, filter }: { value: any; filter: any; params?: ComparatorParams }) => boolean
  between: ({ value, filter }: { value: any; filter: any; params?: ComparatorParams }) => boolean
  objectStringMap: (p: { value: any; filter: any }) => boolean
  arrayLength: ({ value, filter }: { value: any; filter: any }) => boolean
  objectMatch: ({ value, filter, params }: { value: any; filter: any; params: ObjectMapFilterParams; index?: number }) => boolean
}

const VAL_CHECK = {
  string: (value: any): value is string => typeof value === 'string',
  number: (value: any): value is number => typeof value === 'number',
  boolean: (value: any): value is boolean => typeof value === 'boolean',
  strNum: (value: any): value is string | number => typeof value === 'string' || typeof value === 'number',
  strNumBool: (value: any): value is string | number | boolean => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
  strNumBoolNull: (value: any): value is string | number | boolean | null => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null,
  object: (value: any): value is GenericObject => {
    const schema = z.object({})
    const result = schema.safeParse(value)
    if (result.success)
      return true
    else return false
  },
}

const MATCH_MODE_PROCESSOR: T_MATCH_MODE_PROCESSOR = {
  equals: ({ value, filter }) =>
    VAL_CHECK.strNumBoolNull(filter)
    && VAL_CHECK.strNumBoolNull(value)
    && filter === value,
  notEquals: ({ value, filter }) =>
    VAL_CHECK.strNumBoolNull(filter)
    && VAL_CHECK.strNumBoolNull(value)
    && filter !== value,
  exists: ({ value, filter }) => filter ? typeof value !== 'undefined' : typeof value === 'undefined',
  contains: ({ value, filter }) => value?.includes(filter),
  greaterThan: ({ value, filter, params }) => params?.dateMode ? new Date(value) > new Date(filter) : value > filter,
  greaterThanOrEqual: ({ value, filter, params }) => {
    return params?.dateMode ? new Date(value) >= new Date(filter) : value >= filter
  },
  lessThan: ({ value, filter, params }) => params?.dateMode ? new Date(value) < new Date(filter) : value < filter,
  lessThanOrEqual: ({ value, filter, params }) => {
    return params?.dateMode ? new Date(value) <= new Date(filter) : value <= filter
  },
  between: ({ value, filter, params }) => {
    return params?.dateMode ? new Date(value) >= new Date(filter[0]) && new Date(value) <= new Date(filter[1]) : value >= filter[0] && value <= filter[1]
  },
  objectStringMap: p => !!p,
  arrayLength: ({ value, filter }) => Array.isArray(value) && value.length === filter,
  objectMatch: ({ value, filter, params, index }) => {
    const properties = typeof index !== 'undefined' && params.matchPropertyAtIndex ? [params.properties[index]] : params.properties
    return properties[params.operator === 'AND' ? 'every' : 'some' as const](property => MATCH_MODE_PROCESSOR[property.matchMode]({
      value: getObjectProperty({ key: property.key, object: value, scoped: false }),
      filter: getObjectProperty({ key: property.key, object: filter, scoped: false }),
      params: {} as any,
    }))
  },
}

function processFilterWithLookup<
  T extends FilterMatchMode,
  P = Parameters<T_MATCH_MODE_PROCESSOR[T]>[0],
>(params: {
  type: FilterMatchMode
  arrayLookup: 'AND' | 'OR'
  value: any
  filter: any
  params: P extends { params: infer U } ? U : P extends { params?: infer U } ? U : null
  lookupFrom?: 'value' | 'filter'
}) {
  if (!Array.isArray(params.filter) || (params.type === 'between' && validateBetweenPayload(params.filter))) {
    return Array.isArray(params.value)
      ? params.value.some(value =>
        MATCH_MODE_PROCESSOR[params.type]({
          params: params.params as any,
          value,
          filter: params.filter,
        }),
      )
      : MATCH_MODE_PROCESSOR[params.type]({ params: params.params as any, value: params.value, filter: params.filter })
  }

  else if (params.arrayLookup === 'AND') {
    return Array.isArray(params.filter) && params.filter.every((filter, index) => {
      if (Array.isArray(params.value)) {
        return params.value.some(value =>
          MATCH_MODE_PROCESSOR[params.type]({
            params: params.params as any,
            value,
            filter,
            index,
          }),
        )
      }
      else {
        return MATCH_MODE_PROCESSOR[params.type]({ params: params.params as any, value: params.value, filter, index })
      }
    })
  }

  else if (params.arrayLookup === 'OR') {
    return Array.isArray(params.filter) && params.filter.some((filter, index) =>
      Array.isArray(params.value)
        ? params.value.some(value =>
          MATCH_MODE_PROCESSOR[params.type]({
            params: params.params as any,
            value,
            filter,
            index,
          }),
        )
        : MATCH_MODE_PROCESSOR[params.type]({ params: params.params as any, value: params.value, filter, index }),
    )
  }

  return false
}

function validateBetweenPayload(payload: any) {
  return Array.isArray(payload) && payload.length === 2 && payload.every((i: any) => !Array.isArray(i))
}

function processSearchQuery(params: { key: string; object: Record<string, any>; value: string }): boolean {
  const { key, object, value } = params
  const keys = key.split('.')

  let current: any = object
  for (let i = 0; i < keys.length; i++) {
    if (Array.isArray(current))
      return current.some(item => processSearchQuery({ key: keys.slice(i).join('.'), object: item, value }))

    else if (current && Object.prototype.hasOwnProperty.call(current, keys[i]))
      current = current[keys[i]]

    else
      return false
  }

  if (Array.isArray(current))
    return current.some(element => element.toString().toLowerCase().includes(value.toLowerCase()))

  else
    return current?.toString().toLowerCase().includes(value.toLowerCase()) ?? false
}

export async function remoteDataMapper(
  data: Array<GenericObject>,
  datasource: DataSource<GenericObject, false>,
  { searchQuery, page, limit, sortKey, sortOrder, query }: FetchParams,
  fullReload: boolean,
  enablePagination = true,
  rowKey: string | null = null,
): Promise<{
  totalDocs: number
  totalPages: number
  docs: any[]
  rawDocs: any[]
  unpaginatedDocs: any[]
}> {
  try {
    let output: GenericObject[] = []
    if (fullReload) {
      output = (await datasource()).map(item => ({
        ...item,
        __$ROW_ID__: rowKey
          ? getObjectProperty({ key: rowKey, object: item, scoped: false }) ?? generateUUID()
          : generateUUID(),
      }))
    }
    else { output = [...data] }
    const rawOutput = [...output]

    if (searchQuery && searchQuery.value) {
      output = output.filter((item) => {
        for (const key of searchQuery.fields) {
          if (processSearchQuery({ key, object: item, value: searchQuery.value as string }))
            return true
        }
        return false
      })
    }

    // Process sorting
    if (sortKey) {
      output = output.sort((a, b) => {
        const aValue = getObjectProperty({ key: sortKey, object: a, scoped: false })
        const bValue = getObjectProperty({ key: sortKey, object: b, scoped: false })
        if (aValue === bValue)
          return 0
        if (aValue > bValue)
          return sortOrder === 'asc' ? 1 : -1
        if (aValue < bValue)
          return sortOrder === 'asc' ? -1 : 1
        return 0
      })
    }

    if (query && Object.keys(query).length > 0) {
      for (const key in query) {
        const filters = query[key]
        output = output.filter((item) => {
          const value = getObjectProperty({ key, object: item, scoped: false })
          for (const filter of filters) {
            const arrayLookup = typeof filter.arrayLookup === 'function' ? filter.arrayLookup() : filter.arrayLookup ?? 'OR'
            if (filter.matchMode === 'equals') {
              return processFilterWithLookup({
                type: 'equals',
                params: null,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'contains') {
              return processFilterWithLookup({
                type: 'contains',
                params: null,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }
            if (filter.matchMode === 'between') {
              return processFilterWithLookup({
                type: 'between',
                params: filter?.params ?? null,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'greaterThan') {
              return processFilterWithLookup({
                type: 'greaterThan',
                params: filter?.params ?? null,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'greaterThanOrEqual') {
              return processFilterWithLookup({
                type: 'greaterThanOrEqual',
                params: filter?.params ?? null,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'lessThan') {
              return processFilterWithLookup({
                type: 'lessThan',
                params: filter?.params ?? null,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'lessThanOrEqual') {
              return processFilterWithLookup({
                type: 'lessThanOrEqual',
                params: filter?.params ?? null,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'exists') {
              return processFilterWithLookup({
                type: 'exists',
                params: null,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'objectStringMap') {
              return processFilterWithLookup({
                type: 'objectStringMap',
                params: filter.params,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'arrayLength') {
              return processFilterWithLookup({
                type: 'arrayLength',
                params: null,
                arrayLookup,
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'objectMatch') {
              const params = typeof filter.params === 'function' ? filter.params(filter.value) : filter.params
              const filterValue = params?.transformFilterValue?.(filter.value) ?? filter.value
              return processFilterWithLookup({
                type: 'objectMatch',
                params,
                arrayLookup,
                value: filter.lookupAtRoot ? item : value,
                filter: filterValue,
              })
            }
          }
          return false
        })
      }
    }

    const unpaginatedDocs = output
    const totalDocs = output.length
    const totalPages = Math.ceil(totalDocs / limit)

    // Process pagination
    const start = (page - 1) * limit
    const end = start + limit
    output = enablePagination ? output.slice(start, end) : output

    return { totalDocs, totalPages, docs: output, rawDocs: rawOutput, unpaginatedDocs }
  }
  catch (err) {
    console.error(err)
    return {
      rawDocs: [],
      docs: [],
      unpaginatedDocs: [],
      totalPages: 0,
      totalDocs: 0,
    }
  }
}
