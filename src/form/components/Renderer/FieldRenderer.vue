<script setup lang="ts">
import type { Validation } from '@vuelidate/core'
import { vTestid } from '@chronicstone/vue-testid'
import type { FieldInstance } from '@/form/types/instance'
import type { ObjectField, TFieldTypes } from '@/form/types/fields'

const props = withDefaults(
  defineProps<{
    field: FieldInstance
    modelValue: unknown
    parentKey?: string[]
    itemIndex?: number | null
    parentDisabled?: boolean
    parentType?: TFieldTypes | null
    groupLength?: number
    multiStep?: boolean
    stepIndex?: number
    showError?: boolean
    renderLabel?: boolean
    class?: string
  }>(),
  {
    parentKey: () => [],
    itemIndex: null,
    parentDisabled: false,
    multiStep: false,
    stepIndex: undefined,
    showError: true,
    parentType: null,
    groupLength: 0,
    renderLabel: true,
    class: '',
  },
)
const emit = defineEmits<{ (e: 'update:modelValue', value: unknown): void }>()
const _field = computed(() => props.field)
const _parentKey = computed(() => props.parentKey)
const i18n = useTranslations()

const formStyle = useFormStyles()
const collapsed = ref<boolean>(
  Boolean((props.field as ObjectField)?.collapsed ?? false),
)
const fieldSize = useBreakpointStyle(
  props.field?.size ?? (props.parentType === 'group' ? '100%' : ''),
  props.parentType === 'group' ? 'value' : 'col',
)

const fieldValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const { formState, contextMap } = useFormState()
const fieldContext = useFieldContext(_field, fieldValue, formState, _parentKey)

contextMap.value.set(
  [...props.parentKey, props.field.key].join('.'),
  fieldContext,
)
onScopeDispose(() =>
  contextMap.value.delete([...props.parentKey, props.field.key].join('.')),
)

const $globalValidation = useFormValidation()
const $validator = computed(
  () =>
    getObjectProperty({
      key: [
        ...(_field.value._stepRoot ? [_field.value._stepRoot] : []),
        ...props.parentKey,
        _field.value.key,
      ].join('.'),
      scoped: false,
      object: $globalValidation.$validator.value,
    }) as Validation,
)

const errorMessage = computed(() => {
  if (!['array-list', 'array-tabs', 'object'].includes(props.field.type)) {
    return $validator.value.$errors.filter(
      err => err.$validator !== '$each',
    )[0]?.$message
  }
  else {
    if (
      $validator.value.$errors[0]?.$propertyPath
      !== fieldContext.fieldFullPath.value.join('.')
    ) {
      return ['array-tabs', 'array-list'].includes(_field.value.type)
        ? i18n.t('form.validators.invalidArrayProperties', {
          property: normalizeFieldLabel(_field.value, fieldContext),
        })
        : i18n.t('form.validators.invalidObjectProperties', {
          property: normalizeFieldLabel(_field.value, fieldContext),
        })
    }
    else { return $validator.value.$errors[0]?.$message }
  }
})

const FieldComponent = useFieldComponent(_field)

const formTestId = useFormTestId()
const fieldKey = computed(() =>
  [...props.parentKey, _field.value.key].join('.'),
)
</script>

<script lang="ts">
export default {
  name: 'FieldRenderer',
}
</script>

<template>
  <template
    v-if="
      fieldContext.condition.value
        || fieldContext.conditionEffect.value === 'disable'
    "
  >
    <div
      v-if="parentType !== 'group' || renderLabel === true"
      v-testid="[`${formTestId}#field::${fieldKey}::wrapper`]"
      class="flex flex-col gap-2"
      :class="[
        {
          'flex-col': (field?.labelPosition ?? 'top') === 'top',
          'flex-row items-center': (field?.labelPosition ?? 'top') === 'left',
        },
        props.class,
      ]"
      :style="field.size ? fieldSize : formStyle?.fieldSize.value"
    >
      <LabelRenderer
        v-if="
          (!field?.label && field.type === 'info')
            || field.type === 'checkbox'
            || (field.type === 'object'
              && fieldContext.rawInputProps.value?.frameless)
            ? false
            : true
        "
        v-model:collapsed="collapsed"
        :field="field"
        :dependencies="fieldContext.dependencies.value"
        :required="fieldContext.required.value"
        :is-dirty="fieldContext.dirty.value"
        :reset-field="fieldContext.resetField"
      />

      <FieldComponent
        v-model="fieldValue"
        :field="field"
        :context="fieldContext"
        :validator="$validator"
        :disabled="fieldContext.disabled.value || parentDisabled"
        :parent-disabled="parentDisabled"
        :collapsed="collapsed"
        :parent-key="parentKey"
      />

      <div
        v-if="$validator?.$errors?.length && showError"
        class="flex items-center gap-2 transition-all ease-in-out duration-300 transform"
      >
        <span
          v-testid="`${formTestId}#field::${fieldKey}::error`"
          class="text-red-500"
        >{{ errorMessage }}</span>
      </div>
    </div>

    <FieldComponent
      v-else
      v-model="fieldValue"
      v-testid="`${formTestId}#field::${fieldKey}`"
      :field="field"
      :context="fieldContext"
      :validator="$validator"
      :disabled="
        (fieldContext.condition.value === false
          && fieldContext.conditionEffect.value === 'disable')
          || parentDisabled
      "
      :parent-disabled="parentDisabled"
      :collapsed="collapsed"
      :parent-key="parentKey"
      :size="fieldSize"
      :group-length="groupLength"
      :group="true"
    />
  </template>
</template>
