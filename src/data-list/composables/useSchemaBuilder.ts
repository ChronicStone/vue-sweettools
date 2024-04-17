import type { DataSource, FilterBuilderProperty } from '../types/shared'
import type { DataListSchema } from '../types/datalist'
import type { DataTableSchema } from '../types/datatable'
import type { GenericObject } from '@/_shared/types/utils'

export function buildTableSchema<
  Remote extends boolean,
  Source extends DataSource<GenericObject, Remote>,
>(schema: DataTableSchema<Remote, Source>) {
  return schema as unknown as DataTableSchema<
    boolean,
    DataSource<GenericObject, boolean>
  >
}

export function buildListSchema<
  Remote extends boolean,
  Source extends DataSource<GenericObject, Remote>,
>(schema: DataListSchema<Remote, Source>) {
  return schema as unknown as DataListSchema<
    boolean,
    DataSource<GenericObject, boolean>
  >
}

export function defineFilterProperty(params: FilterBuilderProperty) {
  return params
}
