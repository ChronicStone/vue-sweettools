<script setup lang="ts">
import { NColorPicker } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const { scale } = useFormStyles()
const fieldValue = computed({
  get: () => props.modelValue as string | undefined | null,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <NColorPicker v-model:value="fieldValue" v-bind="context.inputProps.value" :size="scale" />
</template>
