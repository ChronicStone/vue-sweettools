<script setup lang="ts">
import { NDatePicker } from 'naive-ui'
import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface'
import { format } from 'date-fns'
import type { DateField, FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const field = computed(() => props.field as DateField)

const { displayFormat, valueFormat } = useLocalizedDateFormat()

const fieldValue = computed({
  get: () => parseOutput(props.modelValue as FormattedValue | null | undefined),
  set: value => emit('update:modelValue', parseInput(value)),
})

function parseInput(value: any) {
  try {
    const _format
      = (props.context.inputProps.value?.format as string)
      ?? displayFormat.value[field.value.type]
    if (!value)
      return null
    const val = Array.isArray(value)
      ? [
          format(new Date(value[0]), _format),
          format(new Date(value[1]), _format),
        ]
      : format(new Date(value), _format)
    return val as FormattedValue
  }
  catch (err) {
    return null
  }
}

function parseOutput(value: FormattedValue | null | undefined) {
  try {
    const _format = (value: string) =>
      !value
        ? null
        : format(
          new Date(value),
          (props.context.rawInputProps.value?.valueFormat as string)
              ?? (props.context.rawInputProps.value?.format as string)
              ?? valueFormat.value[field.value.type],
        )
    if (Array.isArray(value))
      return [_format(value[0]), _format(value[1])] as FormattedValue
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
    v-model:formatted-value="fieldValue"
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
    @blur="validator?.$touch"
  />
</template>
