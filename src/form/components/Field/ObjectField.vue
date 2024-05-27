<script setup lang="ts">
import { NCard, NCollapseTransition } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps, ObjectField, _BaseField } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const _field = computed(() => props.field as _BaseField & ObjectField)

const fieldValue = computed<Record<string, unknown>>({
  get: () => props.modelValue as Record<string, unknown>,
  set: value => emit('update:modelValue', value),
})

const formStyle = useFormStyles()
const gridSize = useBreakpointStyle(props.field.gridSize ?? '', 'grid-cols')
</script>

<template>
  <NCollapseTransition :show="!collapsed">
    <component :is="context?.rawInputProps?.value?.frameless ? 'div' : NCard" :content-style="{ display: 'grid' }">
      <div
        class="grid gap-4"
        :style="field.gridSize ? gridSize : formStyle?.gridSize.value"
      >
        <FieldRenderer
          v-for="(subfield, index) in _field.fields"
          :key="index"
          v-model="fieldValue[subfield.key]"
          :field="subfield"
          :parent-key="[...parentKey, _field.key]"
        />
      </div>
    </component>
  </NCollapseTransition>
</template>
