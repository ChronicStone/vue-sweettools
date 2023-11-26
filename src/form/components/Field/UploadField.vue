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
  if (_field.value.output === 'url')
    fieldValue.value = _field.value.multiple ? fileList.value.map(item => item.url) : fileList.value[0]?.url
  else
    fieldValue.value = _field.value.multiple ? fileList.value : fileList.value[0]
}, { deep: true })

function getFileName(fileUrl: string) {
  return fileUrl.split('/').reverse()[0]
}

function handleFileUpload(options: UploadCustomRequestOptions) {
  return _field.value.uploadHandler(options, props.context.dependencies, props.context.fieldApi)
}

function renderFileIcon(file: UploadSettledFileInfo) {
  return <span class="iconify" data-icon={getFileTypeIcon(file.name)} />
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
