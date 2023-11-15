<script setup lang="ts">
import type {
  UploadFileInfo,
} from 'naive-ui'
import {
  NIcon,
  NP,
  NText,
  NUpload,
  NUploadDragger,
} from 'naive-ui'
import type { SettledFileInfo } from 'naive-ui/es/upload/src/interface'
import type { FieldComponentEmits, FieldComponentProps, UploadField } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const _field = computed(() => props.field as UploadField)

const fieldValue = computed({
  get: () => props.modelValue as UploadFileInfo | UploadFileInfo[],
  set: value => emit('update:modelValue', value),
})

const mappedValue = computed(() => {
  if (_field.value.multiple)
    return !fieldValue.value ? [] : (fieldValue.value as UploadFileInfo[])
  else return !fieldValue.value ? [] : ([fieldValue.value] as UploadFileInfo[])
})

function onFileListUpdate(fileList: SettledFileInfo[]) {
  if (_field.value.multiple)
    fieldValue.value = fileList as UploadFileInfo[]

  else
    fieldValue.value = fileList[0] as UploadFileInfo
}
</script>

<template>
  <NUpload
    :file-list="mappedValue"
    :multiple="_field.multiple"
    :on-update:file-list="onFileListUpdate"
    v-bind="context.inputProps.value"
    :disabled="context.disabled.value"
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
      <NP depth="3" style="margin: 8px 0 0 0">
        Strictly prohibit from uploading sensitive information. For example,
        your bank card PIN or your credit card expiry date.
      </NP>
    </NUploadDragger>
  </NUpload>
  <pre>
    {{ context.inputProps.value }}
  </pre>
</template>
