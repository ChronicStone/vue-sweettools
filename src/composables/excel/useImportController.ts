import ExcelReader from "@/components/ExcelReader/ExcelReader.vue";
import { ImportInfoReturnType, ImportSchema } from "@/types/execl";
import { ExpandRecursively, Narrowable } from "@/types/utils";
import { Ref } from "vue";

export function buildExcelSchema<
  TImportSchema extends ImportSchema<false, FieldKeys>,
  FieldKeys extends Narrowable
>(schema: TImportSchema): TImportSchema {
  return schema;
}

export function useExcelReader<
  TImportSchema extends ImportSchema<false, FieldKeys>,
  FieldKeys extends Narrowable
>(
  readerRef: Ref<InstanceType<typeof ExcelReader> | undefined>,
  schema: TImportSchema
) {
  return {
    validRows: computed(
      () =>
        readerRef.value?.validRows as unknown as Array<
          ExpandRecursively<ImportInfoReturnType<TImportSchema[number]>>
        >
    ),
    invalidRows: computed(() => readerRef.value?.invalidRows ?? []),
    exportInvalidRows: () => readerRef?.value?.exportInvalidRows?.(),
    downloadReferenceFile: () => readerRef?.value?.downloadReferenceFile(),
  };
}
