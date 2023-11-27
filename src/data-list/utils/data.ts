import type { DataSource, FetchParams, FilterMatchMode, ObjectMapFilterParams } from '../types/shared'
import type { GenericObject } from '@/_shared/types/utils'

type T_MATCH_MODE_PROCESSOR = {
  equals: ({ value, filter }: { value: any, filter: any }) => boolean
  notEquals: ({ value, filter }: { value: any, filter: any }) => boolean
  exists: ({ value, filter }: { value: any, filter: any }) => boolean
  contains: ({ value, filter }: { value: any, filter: any }) => boolean
  greaterThan: ({ value, filter }: { value: any, filter: any }) => boolean
  greaterThanOrEqual: ({ value, filter }: { value: any, filter: any }) => boolean
  lessThan: ({ value, filter }: { value: any, filter: any }) => boolean
  lessThanOrEqual: ({ value, filter }: { value: any, filter: any }) => boolean
  between: ({ value, filter }: { value: any, filter: any }) => boolean
  arrayContains: ({ value, filter }: { value: any, filter: any }) => boolean
  objectStringMap: (p: { value: any, filter: any }) => boolean
  arrayLength: ({ value, filter }: { value: any, filter: any }) => boolean
  objectMatch: ({ value, filter, params }: { value: any, filter: any, params: ObjectMapFilterParams }) => boolean
}

type MATCH_MODE_TYPE_BUILDER<T extends { [key in FilterMatchMode]: any }> = T

const MATCH_MODE_PROCESSOR: MATCH_MODE_TYPE_BUILDER<T_MATCH_MODE_PROCESSOR> = {
  equals: ({ value, filter }: { value: unknown, filter: unknown }) => filter === value,
  notEquals: ({ value, filter }: { value: any, filter: any }) => filter !== value,
  exists: ({ value, filter }: { value: any, filter: any }) => filter ? typeof value !== 'undefined' : typeof value === 'undefined',
  contains: ({ value, filter }: { value: any, filter: any }) => value?.includes(filter),
  greaterThan: ({ value, filter }: { value: any, filter: any }) => value > filter,
  greaterThanOrEqual: ({ value, filter }: { value: any, filter: any }) => value >= filter,
  lessThan: ({ value, filter }: { value: any, filter: any }) => value < filter,
  lessThanOrEqual: ({ value, filter }: { value: any, filter: any }) => value <= filter,
  between: ({ value, filter }: { value: any, filter: any }) => value >= filter[0] && value <= filter[1],
  arrayContains: ({ value, filter }: { value: any, filter: any }) => Array.isArray(filter) && filter.includes(value),
  objectStringMap: (p: { value: any, filter: any }) => !!p,
  arrayLength: ({ value, filter }: { value: any, filter: any }) => Array.isArray(value) && value.length === filter,
  objectMatch: ({ value, filter, params }: { value: any, filter: any, params: ObjectMapFilterParams }) => {
    return params.properties[params.operator === 'AND' ? 'every' : 'some' as const]((property) => {
      return MATCH_MODE_PROCESSOR[property.matchMode]({
        value: getObjectProperty({ key: property.key, object: value, scoped: false }),
        filter: getObjectProperty({ key: property.key, object: filter, scoped: false }),
        params: {} as any,
      })
    })
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
  params: P extends { params: infer U } ? U : null
  lookupFrom?: 'value' | 'filter'
}) {
  if (!Array.isArray(params.filter)) {
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
    return Array.isArray(params.filter) && params.filter.every(filter =>
      Array.isArray(params.value)
        ? params.value.some(value =>
          MATCH_MODE_PROCESSOR[params.type]({
            params: params.params as any,
            value,
            filter,
          }),
        )
        : MATCH_MODE_PROCESSOR[params.type]({ params: params.params as any, value: params.value, filter }),
    )
  }

  else if (params.arrayLookup === 'OR') {
    return Array.isArray(params.filter) && params.filter.some((filter) => {
      return Array.isArray(params.value)
        ? params.value.some(value =>
          MATCH_MODE_PROCESSOR[params.type]({
            params: params.params as any,
            value,
            filter,
          }),
        )
        : MATCH_MODE_PROCESSOR[params.type]({ params: params.params as any, value: params.value, filter })
    })
  }

  return false
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
}> {
  try {
    let output: GenericObject[] = []
    if (fullReload) {
      output = (await datasource()).map(item => ({
        ...item,
        __$ROW_ID__: rowKey
          ? getObjectProperty({
            key: rowKey,
            object: item,
            scoped: false,
          }) ?? generateUUID()
          : generateUUID(),
      }))
    }
    else { output = [...data] }
    const rawOutput = [...output]

    if (searchQuery && searchQuery.value) {
      output = output.filter((item) => {
        const keys = Object.keys(item).filter(key =>
          searchQuery.fields.includes(key),
        )
        for (const key of keys) {
          if (
            item[key]
            && item[key]
              ?.toString()
              ?.toLowerCase()
              ?.includes(searchQuery.value!.toLowerCase())
          )
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
            if (filter.matchMode === 'equals') {
              return processFilterWithLookup({
                type: 'equals',
                params: null,
                arrayLookup: filter.arrayLookup ?? 'OR',
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'contains') {
              return processFilterWithLookup({
                type: 'contains',
                params: null,
                arrayLookup: filter.arrayLookup ?? 'OR',
                value,
                filter: filter.value,
              })
            }
            if (filter.matchMode === 'between') {
              return processFilterWithLookup({
                type: 'between',
                params: null,
                arrayLookup: filter.arrayLookup ?? 'OR',
                value,
                filter: filter.value,
              })
            }
            if (filter.matchMode === 'arrayContains') {
              return processFilterWithLookup({
                type: 'arrayContains',
                params: null,
                arrayLookup: filter.arrayLookup ?? 'OR',
                value,
                filter: filter.value,
              })
            }

            if (filter.matchMode === 'objectMatch') {
              return processFilterWithLookup({
                type: 'objectMatch',
                params: filter.params,
                arrayLookup: filter.arrayLookup ?? 'OR',
                value,
                filter: filter.value,
              })
            }
          }
          return false
        })
      }
    }

    const totalDocs = output.length
    const totalPages = Math.ceil(totalDocs / limit)

    // Process pagination
    const start = (page - 1) * limit
    const end = start + limit
    output = enablePagination ? output.slice(start, end) : output

    return { totalDocs, totalPages, docs: output, rawDocs: rawOutput }
  }
  catch (err) {
    console.error(err)
    return {
      rawDocs: [],
      docs: [],
      totalPages: 0,
      totalDocs: 0,
    }
  }
}
