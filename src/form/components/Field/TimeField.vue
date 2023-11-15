<script setup lang="ts">
import { vTestid } from '@chronicstone/vue-testid'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const fieldValue = computed({
  get: () => props.modelValue as number | null | undefined,
  set: value => emit('update:modelValue', value),
})

const formTestId = useFormTestId()
const fieldKey = computed(() =>
  [...props.parentKey, props.field.key].join('.'),
)
const testIdConfig = [
  {
    selector: 'input[type="text"]',
    value: `${formTestId.value}#field::${fieldKey.value}::input`,
  },
]
</script>

<template>
  <NTimePicker
    v-model:value="fieldValue"
    v-testid="testIdConfig"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="context.placeholder.value"
    v-bind="context.inputProps.value"
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
