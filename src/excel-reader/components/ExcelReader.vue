<!-- eslint-disable ts/no-use-before-define -->
<script setup lang="ts">
import {
  NButton,
  NDataTable,
  NDivider,
  NInput,
  NSpin,
  useMessage,
  useThemeVars,
} from 'naive-ui'
import * as XLSX from 'xlsx'
import type { IContent } from 'json-as-xlsx'
import type { ImportSchema } from '../types/reader'

const props = defineProps<{ schema: ImportSchema }>()
const message = useMessage()
const themeVars = useThemeVars()

const i18n = useTranslations()
const uploadLabel = ref<HTMLElement>()
const isHovered = useElementHover(uploadLabel as unknown as HTMLElement)
const isDragged = ref(false)

function loadFileData(e: DragEvent | Event) {
  const file
    = (e as DragEvent)?.dataTransfer?.files[0] ?? (e as any)?.target?.files[0]
  const fileExtension = file?.name?.split('.').pop() ?? ''
  if (!['xls', 'xlsx'].includes(fileExtension))
    return message.error('Only excel files are supported')
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = (e.target as any).result
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const results = XLSX.utils.sheet_to_json(worksheet) as Record<
      string,
      string
    >[]
    rawData.value = [...results]
  }
  reader.readAsArrayBuffer(file)
}

watch(
  () => isHovered.value,
  (value: boolean) => !value && (isDragged.value = false),
)

const _evalSchema = ref<boolean>(false)
const _schema = computedAsync<ImportSchema<true>>(
  () => {
    return Promise.all(
      props.schema.map(async field => ({
        ...field,
        validation: {
          ...field.validation,
          ...(typeof field.validation.enum !== 'undefined' && {
            enum:
              typeof field.validation.enum === 'function'
                ? await field.validation.enum()
                : field.validation.enum,
          }),
        } as ImportSchema<true>[number]['validation'],
      })),
    )
  },
  [],
  _evalSchema,
)

const {
  searchQuery,
  rawData,
  filteredRows,
  validRows,
  invalidRows,
  pagination,
  tableColumns,
} = useImportManager(_schema)

function exportInvalidRows() {
  return exportExcel(
    invalidRows.value as IContent[],
    props.schema.map(({ key }) => ({ label: key, value: key })),
  )
}

function downloadReferenceFile() {
  return generateInportSchemaRefFile(props.schema)
}

defineExpose({
  validRows,
  invalidRows,
  exportInvalidRows,
  downloadReferenceFile,
})
</script>

<template>
  <NSpin :show="_evalSchema">
    <div class="flex flex-col gap-8">
      <NButton
        secondary
        type="primary"
        class="uppercase"
        @click="downloadReferenceFile"
      >
        {{ i18n.t("excelImport.downloadReferenceFileButton") }}
      </NButton>
      <label ref="uploadLabel" for="FileDropZone">
        <div
          class="cursor-pointer w-full h-32 border-2 border-dashed grid place-items-center transition-all ease-in-out duration-150"
          :style="{
            borderRadius: themeVars.borderRadius,
            backgroundColor: themeVars.bodyColor,
            borderColor:
              isDragged || isHovered
                ? themeVars.primaryColor
                : themeVars.borderColor,
          }"
          @drop.prevent="loadFileData"
          @dragover.prevent="isDragged = true"
          @dragleave.prevent="isDragged = false"
        >
          <div class="flex flex-col items-center">
            <mdi:import class="h-8 w-8" />
            <span>{{ i18n.t("excelImport.dropFileOrBrowse") }}</span>
          </div>
        </div>
      </label>
      <input
        id="FileDropZone"
        class="hidden"
        type="file"
        @change="loadFileData"
      >

      <div v-if="rawData?.length">
        <NDivider />

        <div class="flex flex-col gap-4">
          <div class="flex gap-4 justify-between">
            <div>
              <NTag type="success" class="uppercase">
                {{
                  i18n.t("excelImport.countValidRows", {
                    count: validRows?.length ?? 0,
                  })
                }}
              </NTag>
              <NDivider vertical />
              <NTag type="error" class="uppercase">
                {{
                  i18n.t("excelImport.countInvalidRows", {
                    count: invalidRows?.length ?? 0,
                  })
                }}
              </NTag>
            </div>
            <div class="flex items-center gap-3">
              <NInput
                v-model:value="searchQuery"
                placeholder="Search here..."
                clearable
                class="max-w-64"
              />
              <slot
                name="actions"
                :valid-rows="validRows"
                :invalid-rows="invalidRows"
                :export-invalid="exportInvalidRows"
              />
            </div>
          </div>
          <NDataTable
            :columns="tableColumns"
            :data="filteredRows"
            :pagination="pagination"
            :scroll-x="200 * Object.keys(_schema).length"
            table-layout="auto"
            :max-height="320"
          />
        </div>
      </div>
    </div>
  </NSpin>
</template>
