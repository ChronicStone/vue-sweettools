<script setup lang="tsx">
import type {
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadSettledFileInfo,
} from 'naive-ui'
import {
  NIcon,
  NP,
  NText,
  NUpload,
  NUploadDragger,
} from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps, UploadField } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const _field = computed(() => props.field as UploadField)

const fieldValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const fileList = ref<UploadFileInfo[]>(parseInputFileList(fieldValue.value) ?? [])

function parseInputFileList(value: typeof fieldValue['value']): UploadFileInfo[] | undefined {
  if (!value)
    return undefined
  return ((_field.value.multiple && Array.isArray(value) ? value : [value]) as Array<string | UploadFileInfo>).map(item => typeof item === 'string'
    ? {
        id: generateUUID(),
        name: getFileName(item),
        status: 'finished',
        thumbnailUrl: item,
        url: item,
      }
    : item)
}

watch(() => fileList.value, () => {
  const list = fileList.value.filter(item => item.status === 'finished')
  if (_field.value.output === 'url')
    fieldValue.value = _field.value.multiple ? list.map(item => item.url) : list[0]?.url
  else
    fieldValue.value = _field.value.multiple ? list : list[0]
}, { deep: true })

function getFileName(fileUrl: string) {
  return fileUrl.split('/').reverse()[0]
}

function handleFileUpload(options: UploadCustomRequestOptions) {
  return _field.value.uploadHandler(options, props.context.dependencies.value, props.context.fieldApi)
}

function beforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  return _field.value.beforeUpload?.(data, props.context.dependencies.value, props.context.fieldApi)
}

function onFileDelete(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  return _field.value.onFileDelete?.(data, props.context.dependencies.value, props.context.fieldApi)
}

function onFileDownload(file: UploadFileInfo) {
  _field.value.onFileDownload?.(file, props.context.dependencies.value, props.context.fieldApi)
}

function onFilePreview(file: UploadFileInfo) {
  _field.value.onFilePreview?.(file, props.context.dependencies.value, props.context.fieldApi)
}

function renderFileIcon(file: UploadSettledFileInfo) {
  // @ts-expect-error Weird JSX typed props
  return <span class="iconify" data-icon={getFileTypeIcon(file.name)} />
}

function onUploadFinish(data: { file: UploadFileInfo; event?: ProgressEvent }) {
  _field.value.onUploadFinish?.(data, props.context.dependencies.value, props.context.fieldApi)
}

function onUploadError(data: { file: UploadFileInfo; event?: ProgressEvent }) {
  _field.value.onUploadError?.(data, props.context.dependencies.value, props.context.fieldApi)
}
</script>

<template>
  <NUpload
    v-model:file-list="fileList"
    :multiple="_field.multiple ?? false"
    :max="_field.multiple ? undefined : 1"
    v-bind="context.inputProps.value"
    :disabled="context.disabled.value"
    :custom-request="handleFileUpload"
    :on-before-upload="beforeUpload"
    :on-remove="onFileDelete"
    :on-download="onFileDownload"
    :on-preview="onFilePreview"
    :on-finish="onUploadFinish"
    :on-error="onUploadError"
    :render-icon="renderFileIcon"
  >
    <NUploadDragger
      v-if="
        context.rawInputProps.value?.enableDragDrop
          && context.rawInputProps.value?.listType !== 'image-card'
      "
    >
      <div style="margin-bottom: 12px">
        <NIcon size="48" :depth="3">
          <mdi:archive />
        </NIcon>
      </div>
      <NText style="font-size: 16px">
        Click or drag a file to this area to upload
      </NText>
      <NP v-if="context.inputProps.value.accept" depth="3" style="margin: 8px 0 0 0">
        Accepted : {{ (context.inputProps.value.accept as string ?? '')?.split(',').join(', ') ?? 'any' }}
      </NP>
    </NUploadDragger>
  </NUpload>
</template>
