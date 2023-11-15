<script setup lang="ts">
import { NCheckbox } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const fieldValue = computed({
  get: () => props.modelValue as string | number | boolean | undefined,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <div v-if="field.type === 'checkbox'" class="flex items-center gap-2">
    <NCheckbox
      v-model:checked="fieldValue"
      v-bind="context.inputProps.value"
      :disabled="disabled"
      @blur="validator?.$touch"
    >
      <div class="flex items-center gap-2">
        <LabelRenderer
          :field="field"
          :required="context.required.value"
          :dependencies="context.dependencies.value"
          :render-description="false"
        />
        <span class="text-red-500 ml-1.5">
          {{ context.required.value ? "*" : "" }}
        </span>
      </div>
    </NCheckbox>
    <DescriptionPopup
      v-if="field.description"
      :description="field.description"
      :field-label="field.label"
    />
  </div>
</template>
