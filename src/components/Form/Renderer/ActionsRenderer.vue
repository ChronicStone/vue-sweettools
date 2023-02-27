<script setup lang="ts">
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

const { getProp } = useGlobalConfig(props.schema);
</script>

<template>
  <NButton
    v-if="getProp('uiConfig.showCancelButton')"
    secondary
    type="error"
    @click="emit('close')"
  >
    {{ getProp("textOverrides.cancelBtnMessage") }}
  </NButton>
  <NButton
    v-if="getProp('uiConfig.showPrevButton') && isMultiStep"
    secondary
    :disabled="currentStepIndex === 0"
    type="primary"
    @click="emit('previousStep')"
  >
    {{ getProp("textOverrides.prevBtnMessage") }}
  </NButton>
  <NButton secondary type="primary" @click="emit('submit')"
    >{{
      isMultiStep
        ? `${
            currentStepIndex === formSteps.length - 1
              ? schema?.submitButtonText ??
                getProp("textOverrides.submitBtnMessage")
              : getProp("textOverrides.nextBtnMessage")
          }`
        : getProp("textOverrides.submitBtnMessage")
    }}
  </NButton>
</template>
