<script setup lang="ts">
import { NSelect } from 'naive-ui'
import type { Value } from 'naive-ui/es/select/src/interface'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const fieldValue = computed({
  get: () => props.modelValue as Value | null | undefined,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <NSelect
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="context.placeholder.value"
    :options="context.options.value"
    v-bind="context.inputProps.value"
    :loading="context._evalOptions.value"
    filterable
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
