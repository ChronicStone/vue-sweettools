<script setup lang="ts">
import { StepInstance, StepStatus } from "@/types/form/instance";
import { NStep, NSteps, useThemeVars } from "naive-ui";

const props = defineProps<{
  steps: StepInstance[];
  currentStepIndex: number;
}>();

const formStyle = useFormStyles();
const themeVars = useThemeVars();
const progressPercent = computed(
  () => ((props.currentStepIndex + 1) / props.steps.length) * 100
);
const currentStep = computed(() => props.steps[props.currentStepIndex]);

const currentStatus = computed<"process" | "finish" | "error" | "wait">(() => {
  const currentStep = props.steps[props.currentStepIndex];
  if (currentStep._status === StepStatus.PENDING) return "wait";
  if (currentStep._status === StepStatus.IN_PROGRESS) return "process";
  if (currentStep._status === StepStatus.COMPLETED) return "finish";
  if (currentStep._status === StepStatus.INVALID) return "error";
  return "wait";
});

const progressColor = computed(() => {
  const currentStep = props.steps[props.currentStepIndex];
  if (currentStep._status === StepStatus.PENDING)
    return themeVars.value.primaryColor;
  if (currentStep._status === StepStatus.IN_PROGRESS)
    return themeVars.value.primaryColor;
  if (currentStep._status === StepStatus.COMPLETED)
    return themeVars.value.primaryColor;
  if (currentStep._status === StepStatus.INVALID)
    return themeVars.value.errorColor;
});
</script>

<template>
  <div
    v-if="formStyle?.stepperLayout.value === 'full'"
    class="flex justify-center"
  >
    <NSteps :current="currentStepIndex + 1" :status="currentStatus">
      <NStep v-for="({ title }, index) in steps" :key="index" :title="title" />
    </NSteps>
  </div>

  <div v-else class="flex items-center gap-4 h-auto w-auto">
    <NProgress
      style="transform: scale(0.8)"
      :height="4"
      :color="progressColor"
      type="circle"
      :percentage="progressPercent"
    >
      {{ currentStepIndex + 1 }} of {{ steps.length }}
    </NProgress>

    <div class="w-full flex justify-end text-right">
      <h1 class="text-center uppercase text-xl">{{ currentStep.title }}</h1>
    </div>
  </div>
</template>
