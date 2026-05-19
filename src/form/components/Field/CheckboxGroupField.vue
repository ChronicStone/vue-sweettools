<script setup lang="ts">
import type { TestIdSelector } from '@chronicstone/vue-testid'
import { vTestid } from '@chronicstone/vue-testid'
import { NCheckbox, NCheckboxGroup } from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { FieldComponentEmits, FieldComponentProps } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const fieldValue = computed({
  get: () => props.modelValue as (string | number)[] | null | undefined,
  set: value => emit('update:modelValue', value),
})

const formStyle = useFormStyles()
const gridSize = useBreakpointStyle(props.field.gridSize ?? '', 'grid-cols')

const { scale } = useFormStyles()
const formTestId = useFormTestId()
const fieldKey = computed(() =>
  [...props.parentKey, props.field.key].join('.'),
)
const testIdConfig = [
  {
    selector: '.n-checkbox',
    value: index =>
      `${formTestId.value}#field::${fieldKey.value}::input::${index}`,
    multiple: true,
  },
] satisfies TestIdSelector

const options = computed(() => {
  return (props.context.options.value ?? []) as unknown as Array<{
    label: string | (() => VNodeChild)
    value: string | number | undefined
  }>
})
</script>

<template>
  <NCheckboxGroup
    v-if="field.type === 'checkbox-group'"
    v-model:value="fieldValue"
    v-bind="context.inputProps.value"
    v-testid="testIdConfig"
    :disabled="disabled"
    :size="scale"
  >
    <div
      class="grid gap-4"
      :style="field.gridSize ? gridSize : formStyle?.gridSize.value"
    >
      <NCheckbox
        v-for="(option, index) in options"
        :key="index"
        class="col-span-1"
        :value="option.value"
        :disabled="disabled"
        :size="scale"
        @blur="validator?.$touch"
      >
        <component :is="renderVNode(option.label ?? '')" />
      </NCheckbox>
    </div>
  </NCheckboxGroup>
</template>
