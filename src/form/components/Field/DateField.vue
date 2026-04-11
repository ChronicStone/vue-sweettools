<script setup lang="ts">
import { NDatePicker } from 'naive-ui'
import { format } from 'date-fns'
import type { DateField, FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const { scale } = useFormStyles()
const field = computed(() => props.field as DateField)

const { displayFormat, valueFormat } = useLocalizedDateFormat()

const fieldValue = computed({
  get: () => formatDateToTimestamp(props.modelValue),
  set: value => emit('update:modelValue', formatTimestampToDate(value)),
})

function formatTimestampToDate(value: any) {
  try {
    const _format
      = (props.context.inputProps.value?.format as string)
      ?? valueFormat.value[field.value.type]
    if (!value)
      return null
    const val = Array.isArray(value)
      ? [
          format(new Date(value[0]), _format),
          format(new Date(value[1]), _format),
        ]
      : format(new Date(value), _format)
    return val
  }
  catch (err) {
    return null
  }
}

function formatDateToTimestamp(value: any) {
  try {
    const _format = (value: number) =>
      !value
        ? null
        : new Date(value).getTime()
    if (Array.isArray(value))
      return [_format(value[0]), _format(value[1])]
    if (!value)
      return null
    return _format(value)
  }
  catch (err) {
    return value
  }
}
</script>

<template>
  <NDatePicker
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="context.placeholder.value"
    :type="field.type"
    v-bind="{
      ...context.inputProps.value,
      format: (props.context.inputProps.value?.format as string)
        ?? displayFormat[field.type],
    }"
    update-value-on-close
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    :size="scale"
    @blur="validator?.$touch"
  />
</template>
