<script setup lang="ts">
import { NSlider } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()

const fieldValue = computed({
  get: () => props.modelValue as number | number[] | undefined,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <div
    class="flex flex-col gap-1 justify-center items-center h-full"
  >
    <NSlider
      v-model:value="fieldValue"
      v-bind="context.inputProps.value"
      :disabled="disabled"
      @blur="validator?.$touch"
    />
  </div>
</template>
