import type { ImportInfoReturnType, ImportSchema } from '../types/reader'
import type ExcelReader from '../components/ExcelReader.vue'
import type { ExpandRecursively, Narrowable } from '@/_shared/types/utils'

export function useExcelReader<
  TImportSchema extends ImportSchema<false, FieldKeys>,
  FieldKeys extends Narrowable,
>(
  readerRef: Ref<InstanceType<typeof ExcelReader> | undefined>,
  _schema: TImportSchema,
) {
  return {
    validRows: computed(
      () =>
        readerRef.value?.validRows as unknown as Array<
          ExpandRecursively<ImportInfoReturnType<TImportSchema[number]>>
        >,
    ),
    invalidRows: computed(() => readerRef.value?.invalidRows ?? []),
    exportInvalidRows: () => readerRef?.value?.exportInvalidRows?.(),
    downloadReferenceFile: () => readerRef?.value?.downloadReferenceFile(),
  }
}
