<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import { NButton } from 'naive-ui'
import type { MaybeRef } from 'vue'
import type { FormSchema } from '@/form/types/form'
import type { FieldInstance, FormRefInstance } from '@/form/types/instance'
import { StepStatus } from '@/form/types/instance'

const props = defineProps<{
  schema: FormSchema<any, any>
  data?: Record<string, unknown>
  modalMode?: boolean
  _resolve?:
  | ((isCompleted: boolean, formData: Record<string, unknown>) => void)
  | null
}>()

const i18n = useTranslations()
const _formSchema = computed<FormSchema>(() => props.schema)
const _modalMode = computed<boolean>(() => props.modalMode)

const formTestId = useProvideFormTestId(_formSchema)
const libConfig = useGlobalConfig(props.schema)

const { formFields, filteredFormFields, isMultiStep, formSteps, currentStep }
  = useProvideFormFields(_formSchema)

const { formState, outputFormState, reset, getFieldApi } = useProvideFormState(
  formFields,
  props.data,
)

const layoutConf = useProvideFormStyles(props.schema)
const LayoutContainer = useFormLayout(_modalMode, layoutConf)

const { $validator } = useProvideFormValidation(
  filteredFormFields,
  formState,
  getFieldApi,
)

function updateRootFieldValue(field: FieldInstance, value: unknown) {
  if (field._stepRoot)
    formState.value[field._stepRoot][field.key] = value
  else formState.value[field.key] = value
}

async function nextStep() {
  const isValid = await $validator.value.$validate()
  await $validator.value.$touch()
  if (!isValid) {
    formSteps.value[currentStep.value]._status = StepStatus.INVALID
    return false
  }

  formSteps.value[currentStep.value]._status = StepStatus.COMPLETED
  if (currentStep.value !== formSteps.value.length - 1) {
    formSteps.value[currentStep.value + 1]._status
      = formSteps.value[currentStep.value + 1]._status === StepStatus.INVALID
        ? StepStatus.INVALID
        : StepStatus.IN_PROGRESS
    currentStep.value = currentStep.value + 1
  }

  return true
}

function previousStep() {
  if (currentStep.value <= 0)
    return false
  formSteps.value[currentStep.value - 1]._status = StepStatus.IN_PROGRESS
  currentStep.value = currentStep.value - 1
}

function closeForm() {
  props._resolve?.(false, unwrapReactivity(formState))
}

async function submitForm() {
  const isValid = await $validator.value.$validate()
  if (!isValid)
    return

  props?._resolve?.(true, unwrapReactivity(outputFormState))
}

function unwrapReactivity(value: MaybeRef<Record<string, unknown>>) {
  return JSON.parse(JSON.stringify(unref(value)))
}

defineExpose<FormRefInstance>({
  $data: outputFormState,
  $reset: reset,
  $validate: () => $validator.value.$validate(),
  $v: computed(() => $validator.value),
  ...(isMultiStep.value && {
    nextStep,
    previousStep,
    currentStep: computed(() => currentStep.value),
    canTriggerNext: computed(
      () =>
        isMultiStep.value && currentStep.value !== formSteps.value.length - 1,
    ),
    canTriggerPrevious: computed(
      () => isMultiStep.value && currentStep.value > 0,
    ),
  }),
})
</script>

<template>
  <LayoutContainer
    v-testid="{ selector: 'form', value: `${formTestId}#form::root` }"
    :schema="schema"
    @close="closeForm"
  >
    <template #title>
      <h1
        v-if="typeof schema.title === 'string'"
        class="text-center uppercase text-xl"
      >
        {{ schema.title }}
      </h1>

      <component :is="renderVNode(schema.title)" v-else />
    </template>

    <template v-if="isMultiStep && libConfig.getProp('uiConfig.showStepper')" #stepper>
      <StepsRenderer :steps="formSteps" :current-step-index="currentStep" />
    </template>

    <template #fields>
      <FieldRenderer
        v-for="(field, index) in filteredFormFields"
        :key="index"
        :field="field"
        :model-value="
          field._stepRoot
            ? formState[field._stepRoot][field.key]
            : formState[field.key]
        "
        @update:model-value="updateRootFieldValue(field, $event)"
      />
    </template>

    <template #actions>
      <NButton
        v-if="libConfig.getProp('uiConfig.showCancelButton')"
        v-testid="`${formTestId}#form::cancel`"
        secondary
        type="error"
        @click="closeForm"
      >
        {{ i18n.t("form.actions.cancelButton") }}
      </NButton>
      <NButton
        v-if="libConfig.getProp('uiConfig.showPrevButton') && isMultiStep"
        v-testid="`${formTestId}#form::previous`"
        secondary
        :disabled="currentStep === 0"
        type="primary"
        @click="previousStep"
      >
        <template v-if="isMultiStep" #icon>
          <mdi:chevron-left />
        </template>
        {{ i18n.t("form.actions.prevButton") }}
      </NButton>
      <NButton
        v-testid="`${formTestId}#form::submit`"
        type="primary"
        icon-placement="right"
        @click="
          currentStep === formSteps.length - 1 || !isMultiStep
            ? submitForm()
            : nextStep()
        "
      >
        <template
          v-if="isMultiStep && currentStep !== formSteps.length - 1"
          #icon
        >
          <mdi:chevron-right />
        </template>
        {{
          isMultiStep
            ? `${
              currentStep === formSteps.length - 1
                ? i18n.t("form.actions.submitButton")
                : i18n.t("form.actions.nextButton")
            }`
            : i18n.t("form.actions.submitButton")
        }}
      </NButton>
    </template>
  </LayoutContainer>
</template>

<style>
:is(.n-input__textarea-el, .n-tooltip) {
  overscroll-behavior-y: contain;
}

:is(.n-input__textarea-el, .n-tooltip, .editor__content)::-webkit-scrollbar {
  width: 5px;
  cursor: pointer !important;
}

:is(
    .n-input__textarea-el,
    .n-tooltip,
    .editor__content
  )::-webkit-scrollbar-thumb {
  @apply bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer hover:bg-gray-300;
  cursor: pointer !important;
}

:is(
    .n-input__textarea-el,
    .n-tooltip,
    .editor__content
  )::-webkit-scrollbar-track {
  background: transparent;
  padding: 5px;
}
</style>
