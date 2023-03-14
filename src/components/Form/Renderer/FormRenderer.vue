<script setup lang="ts">
import { FormSchema } from "@/types/form/form";
import FieldRenderer from "./FieldRenderer.vue";
import {
  FieldInstance,
  FormRefInstance,
  StepStatus,
} from "@/types/form/instance";
import { _BaseField } from "@/types/form/fields";
import StepsRenderer from "./StepsRenderer.vue";

const emit = defineEmits<{ (e: "test"): void }>();
const props = defineProps<{
  schema: FormSchema;
  data?: any;
  modalMode?: boolean;
  _resolve?: (() => void) | null;
}>();

const _formSchema = computed<FormSchema>(() => props.schema);
const _modalMode = computed<boolean>(() => props.modalMode);

const { formFields, filteredFormFields, isMultiStep, formSteps, currentStep } =
  useProvideFormFields(_formSchema);

const { formState, outputFormState, reset } = useProvideFormState(
  formFields,
  props.data,
  props.schema.sharedStore
);

const layoutConf = useProvideFormStyles(props.schema);
const LayoutContainer = useFormLayout(_modalMode, layoutConf);

const { $validator } = useProvideFormValidation(filteredFormFields, formState);

function updateRootFieldValue(field: FieldInstance, value: unknown) {
  if (field._stepRoot) formState.value[field._stepRoot][field.key] = value;
  else formState.value[field.key] = value;
}

async function nextStep() {
  const isValid = await $validator.value.$validate();
  await $validator.value.$touch();
  if (!isValid) {
    formSteps.value[currentStep.value]._status = StepStatus.INVALID;
    return false;
  }

  if (currentStep.value !== formSteps.value.length - 1) {
    formSteps.value[currentStep.value]._status = StepStatus.COMPLETED;
    formSteps.value[currentStep.value + 1]._status =
      formSteps.value[currentStep.value + 1]._status === StepStatus.INVALID
        ? StepStatus.INVALID
        : StepStatus.IN_PROGRESS;
    currentStep.value = currentStep.value + 1;
  }

  return true;
}

function previousStep() {
  if (currentStep.value <= 0) return false;
  formSteps.value[currentStep.value - 1]._status = StepStatus.IN_PROGRESS;
  currentStep.value = currentStep.value - 1;
}

defineExpose<FormRefInstance>({
  $data: outputFormState,
  $reset: reset,
  $validate: () => $validator.value.$validate(),
  ...(isMultiStep && {
    nextStep,
    previousStep,
  }),
});
</script>

<template>
  <LayoutContainer>
    <template v-if="isMultiStep" #header>
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
