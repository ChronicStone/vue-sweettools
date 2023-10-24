<script setup lang="ts">
import { useTranslations } from "@/i18n/composables/useTranslations";
import { FormSchema } from "@/types/form/form";
import { StepInstance } from "@/types/form/instance";
import { NButton } from "naive-ui";

const props = defineProps<{
  schema: FormSchema;
  isMultiStep: boolean;
  currentStepIndex: number;
  formSteps: StepInstance[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "nextStep"): void;
  (e: "previousStep"): void;
  (e: "submit"): void;
}>();

const i18n = useTranslations();
const { getProp } = useGlobalConfig(props.schema);
</script>

<template>
  <NButton
    v-if="getProp('uiConfig.showCancelButton')"
    secondary
    type="error"
    @click="emit('close')"
  >
    {{ i18n.t("form.actions.cancelButton") }}
  </NButton>
  <NButton
    v-if="getProp('uiConfig.showPrevButton') && isMultiStep"
    secondary
    :disabled="currentStepIndex === 0"
    type="primary"
    @click="emit('previousStep')"
  >
    {{ i18n.t("form.actions.prevButton") }}
  </NButton>
  <NButton secondary type="primary" @click="emit('submit')"
    >{{
      isMultiStep
        ? `${
            currentStepIndex === formSteps.length - 1
              ? schema?.submitButtonText ?? i18n.t("form.actions.submitButton")
              : i18n.t("form.actions.nextButton")
          }`
        : i18n.t("form.actions.submitButton")
    }}
  </NButton>
</template>
