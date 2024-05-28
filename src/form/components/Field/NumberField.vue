<script setup lang="ts">
import { NInputNumber } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const { scale } = useFormStyles()
const fieldValue = computed({
  get: () => props.modelValue as number | undefined | null,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <NInputNumber
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    v-bind="context.inputProps.value"
    :placeholder="context.placeholder.value"
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    :size="scale"
    @blur="validator?.$touch"
  >
    <template v-if="context.rawInputProps.value.prefix" #prefix>
      <component :is="renderVNode(context.rawInputProps.value.prefix)" />
    </template>

    <template v-if="context.rawInputProps.value.suffix" #suffix>
      <component :is="renderVNode(context.rawInputProps.value.suffix)" />
    </template>
  </NInputNumber>
</template>
