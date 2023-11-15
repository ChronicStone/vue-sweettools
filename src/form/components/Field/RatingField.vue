<script setup lang="ts">
import { NRate } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const fieldValue = computed({
  get: () => props.modelValue as number | undefined,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <NRate v-model:value="fieldValue" v-bind="context.inputProps.value" />
</template>
