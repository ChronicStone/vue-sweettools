<script setup lang="ts">
import { NCascader } from 'naive-ui'
import type { Value } from 'naive-ui/es/cascader/src/interface'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const { scale } = useFormStyles()
const fieldValue = computed({
  get: () => props.modelValue as Value | null | undefined,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <NCascader
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="context.placeholder.value"
    :options="(context.options.value as any)"
    v-bind="context.inputProps.value"
    :loading="context._evalOptions.value"
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    filterable
    :size="scale"
    @blur="validator?.$touch"
  />
</template>
