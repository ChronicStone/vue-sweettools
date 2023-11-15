import type { DataGridSchema } from './types'
import type { GenericObject } from '@/_shared/types/utils'

export function buildGridSchema<T extends GenericObject>(
  schema: DataGridSchema<T>,
) {
  return schema as unknown as DataGridSchema<GenericObject>
}
