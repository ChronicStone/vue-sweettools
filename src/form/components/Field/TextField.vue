<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import type { MaskInputOptions, MaskOptions } from 'maska'
import type { InputInst } from 'naive-ui'
import type { FieldComponentEmits, FieldComponentProps, TextField } from '@/form/types/fields'
import { vTestid } from '@chronicstone/vue-testid'
import { MaskInput } from 'maska'
import { NInput } from 'naive-ui'

const props = defineProps<FieldComponentProps>()
const emit = defineEmits<FieldComponentEmits>()
const { scale } = useFormStyles()
const _field = computed(() => props.field as TextField)
const inputRef = ref<InputInst | null>(null)
let maskInput: MaskInput | undefined

const fieldValue = computed({
  get: () => props.modelValue as string | [string, string] | null | undefined,
  set: value => emit('update:modelValue', value),
})

const maskConfig = computed<MaskInputOptions | undefined>(() => {
  const maskConf = props.context.inputProps.value?.mask
  if (!maskConf)
    return undefined
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

function syncMask() {
  const nativeInput
    = inputRef.value?.inputElRef
      ?? inputRef.value?.textareaElRef
      ?? null

  if (!nativeInput || !maskConfig.value?.mask) {
    maskInput?.destroy()
    maskInput = undefined
    return
  }

  if (maskInput)
    maskInput.update(maskConfig.value)
  else maskInput = new MaskInput(nativeInput as HTMLInputElement, maskConfig.value)
}

watch(maskConfig, () => nextTick(syncMask), { deep: true, immediate: true })
onMounted(() => nextTick(syncMask))
onBeforeUnmount(() => maskInput?.destroy())
</script>

<template>
  <NInput
    ref="inputRef"
    v-model:value="fieldValue"
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
    :size="scale"
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
