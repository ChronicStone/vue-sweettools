<script setup lang="ts">
import { NButton } from "naive-ui";
import { FormSchema } from "@/types/form/form";
import FieldRenderer from "./FieldRenderer.vue";
import {
  FieldInstance,
  FormRefInstance,
  StepStatus,
} from "@/types/form/instance";
import { _BaseField } from "@/types/form/fields";
import StepsRenderer from "./StepsRenderer.vue";
import { MaybeRef } from "@vueuse/core";

const emit = defineEmits<{ (e: "test"): void }>();
const props = defineProps<{
  schema: FormSchema;
  data?: Record<string, unknown>;
  modalMode?: boolean;
  // eslint-disable-next-line vue/prop-name-casing
  _resolve?:
    | ((isCompleted: boolean, formData: Record<string, unknown>) => void)
    | null;
}>();

const _formSchema = computed<FormSchema>(() => props.schema);
const _modalMode = computed<boolean>(() => props.modalMode);

const libConfig = useGlobalConfig(props.schema);

const { formFields, filteredFormFields, isMultiStep, formSteps, currentStep } =
  useProvideFormFields(_formSchema);

const { formState, outputFormState, virtualStore, reset } = useProvideFormState(
  formFields,
  props.data,
  props.schema.sharedStore
);

const layoutConf = useProvideFormStyles(props.schema);
const LayoutContainer = useFormLayout(_modalMode, layoutConf);

const { $validator } = useProvideFormValidation(
  filteredFormFields,
  formState,
  virtualStore
);

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

  formSteps.value[currentStep.value]._status = StepStatus.COMPLETED;
  if (currentStep.value !== formSteps.value.length - 1) {
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

function closeForm() {
  props._resolve?.(false, unwrapReactivity(formState));
}

async function submitForm() {
  const isValid = await $validator.value.$validate();
  if (!isValid) return;

  props?._resolve?.(true, unwrapReactivity(formState));
}

function unwrapReactivity(value: MaybeRef<Record<string, unknown>>) {
  return JSON.parse(JSON.stringify(unref(value)));
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
  <LayoutContainer :schema="schema" @close="closeForm">
    <template v-if="schema.title" #title>
      <h1
        v-if="typeof schema.title === 'string'"
        class="text-center uppercase text-xl"
      ></h1>
      <component :is="renderVNode(schema.title)" v-else />
    </template>

    <template v-if="isMultiStep" #stepper>
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
        secondary
        type="error"
        @click="closeForm"
      >
        {{ libConfig.getProp("textOverrides.cancelBtnMessage") }}
      </NButton>
      <NButton
        v-if="libConfig.getProp('uiConfig.showPrevButton') && isMultiStep"
        secondary
        :disabled="currentStep === 0"
        type="primary"
        @click="previousStep"
      >
        <template v-if="isMultiStep" #icon>
          <mdi:chevron-left />
        </template>
        {{ libConfig.getProp("textOverrides.prevBtnMessage") }}
      </NButton>
      <NButton
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
                  ? libConfig.getProp("textOverrides.submitBtnMessage")
                  : libConfig.getProp("textOverrides.nextBtnMessage")
              }`
            : libConfig.getProp("textOverrides.submitBtnMessage")
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
