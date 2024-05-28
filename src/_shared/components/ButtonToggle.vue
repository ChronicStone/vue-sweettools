<script lang="ts" setup>
import type { QuickFilterObject, QuickFilterPrimitive } from '@/data-list/types/shared'

const props = defineProps<{
  options: QuickFilterObject[]
  itemWidth?: number
  multiple?: boolean
  size?: 'small' | 'medium' | 'large'
}>()
const { modelValue } = defineModels<{ modelValue: QuickFilterPrimitive | QuickFilterPrimitive[] }>()

function handleSelect(value: QuickFilterPrimitive) {
  if (props.multiple) {
    if (!Array.isArray(modelValue.value))
      modelValue.value = [value]
    else if (!modelValue.value.includes(value))
      modelValue.value.push(value)
    else
      modelValue.value = modelValue.value.filter(v => v !== value)
  }
  else if (modelValue.value !== value) { modelValue.value = value }
  else { modelValue.value = undefined }
}

function isValueSelected(value: QuickFilterPrimitive) {
  return Array.isArray(modelValue.value)
    ? modelValue.value.includes(value)
    : modelValue.value === value
}
</script>

<template>
  <NButtonGroup>
    <NButton
      v-for="(option, index) in options"
      :key="index"
      :style="{ width: itemWidth ? `${itemWidth}px !important` : '' }"
      :secondary="isValueSelected(option.value)"
      :type="isValueSelected(option.value) ? 'primary' : 'default'"
      :size="size"
      @click="handleSelect(option.value)"
    >
      <component :is="renderVNode(option.label)" />
    </NButton>
  </NButtonGroup>
</template>
