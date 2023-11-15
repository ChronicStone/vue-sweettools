<script setup lang="ts">
import type { DynamicTagsOption } from 'naive-ui'
import { NDynamicTags } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const fieldValue = computed({
  get: () => props.modelValue as (string | DynamicTagsOption)[] | undefined,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <NDynamicTags
    v-model:value="fieldValue"
    v-bind="context.inputProps.value"
    :disabled="disabled"
    @blur="validator?.$touch"
  />
</template>
