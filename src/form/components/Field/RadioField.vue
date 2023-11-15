<script setup lang="ts">
import { NRadio, NRadioGroup } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const fieldValue = computed({
  get: () => props.modelValue as string | number | boolean | null | undefined,
  set: value => emit('update:modelValue', value),
})

const options = computed(() => {
  return (props.context.options.value ?? []) as unknown as Array<{
    label: string | (() => VNodeChild)
    value: string | number | boolean | undefined
  }>
})

console.log('options', props)
</script>

<template>
  <NRadioGroup
    v-if="field.type === 'radio'"
    v-model:value="fieldValue"
    :name="field.key"
    :disabled="disabled"
    @blur="validator?.$touch"
  >
    <div class="gap-4 flex flex-wrap justify-start">
      <NRadio
        v-for="(option, optionId) in options"
        :key="optionId"
        :style="
          optionId
            === (context.options.value?.length ?? field?.options?.length) - 1
            ? 'margin-right: auto;'
            : ''
        "
        :value="option.value"
        v-bind="context.inputProps.value"
        @blur="validator?.$touch"
      >
        <component :is="renderVNode(option.label ?? '')" />
      </NRadio>
    </div>
  </NRadioGroup>
</template>
