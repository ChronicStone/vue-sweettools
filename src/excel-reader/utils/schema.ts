import type { ImportSchema } from '../types/reader'
import type { Narrowable } from '@/_shared/types/utils'

export function buildExcelSchema<
  TImportSchema extends ImportSchema<false, FieldKeys>,
  FieldKeys extends Narrowable,
>(schema: TImportSchema): TImportSchema {
  return schema
}
