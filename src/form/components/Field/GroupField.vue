<script setup lang="ts">
import { NInputGroup } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps, ObjectField, _BaseField } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const _field = computed(() => props.field as _BaseField & ObjectField)

const fieldValue = computed<Record<string, unknown>>({
  get: () => props.modelValue as Record<string, unknown>,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <NInputGroup>
    <FieldRenderer
      v-for="(subfield, index) in _field.fields"
      :key="index"
      v-model="fieldValue[subfield.key]"
      :field="subfield"
      :parent-key="[...parentKey, _field.key]"
      parent-type="group"
      :group-length="_field.fields.length"
      :render-label="false"
    />
  </NInputGroup>
</template>
