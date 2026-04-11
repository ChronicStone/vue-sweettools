<script setup lang="ts">
import { NSwitch } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const { scale } = useFormStyles()
const fieldValue = computed({
  get: () => props.modelValue as boolean,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <NSwitch v-model:value="fieldValue" :size="scale" />
</template>
