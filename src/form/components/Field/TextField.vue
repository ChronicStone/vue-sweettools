<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { vTestid } from '@chronicstone/vue-testid'
import type { MaskOptions } from 'maska'
import { vMaska } from 'maska'
import { NInput } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps, TextField } from '@/form/types/fields'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const _field = computed(() => props.field as TextField)

const fieldValue = computed({
  get: () => props.modelValue as string | [string, string] | null | undefined,
  set: value => emit('update:modelValue', value),
})

const maskConfig = computed(() => {
  const maskConf = props.context.inputProps.value?.mask
  if (!maskConf)
    return {}
  else if (typeof maskConf === 'string')
    return { mask: maskConf }
  return maskConf as MaskOptions
})

const fieldProps = computed(() => {
  const { mask, ...params } = props.context.inputProps.value
  return params
})

const formTestId = useFormTestId()
const fieldKey = computed(() =>
  [...props.parentKey, props.field.key].join('.'),
)
const testIdConfig = [
  {
    selector: 'input[type="text"]',
    value: `${formTestId.value}#field::${fieldKey.value}::input`,
  },
]
</script>

<template>
  <NInput
    v-model:value="fieldValue"
    v-maska:[maskConfig]
    v-testid="testIdConfig"
    :style="group ? { width: `${size} !important` } : {}"
    :class="{ fieldError: validator?.$errors?.length }"
    :type="_field.type"
    v-bind="fieldProps"
    :placeholder="context.placeholder.value"
    :disabled="
      (context.condition.value === false
        && context.conditionEffect.value === 'disable')
        || parentDisabled
    "
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  >
    <template v-if="context.rawInputProps.value.prefix" #prefix>
      <component :is="renderVNode(context.rawInputProps.value.prefix)" />
    </template>

    <template v-if="context.rawInputProps.value.suffix" #suffix>
      <component :is="renderVNode(context.rawInputProps.value.suffix)" />
    </template>
  </NInput>
</template>
