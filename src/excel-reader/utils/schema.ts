import type { ImportSchema } from '../types/reader'
import type { Narrowable } from '@/_shared/types/utils'

export function buildExcelSchema<
  const TImportSchema extends ImportSchema<FieldKeys>,
  const FieldKeys extends Narrowable,
>(schema: TImportSchema): TImportSchema {
  return schema
}
