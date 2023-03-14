<script setup lang="ts">
import { StepInstance, StepStatus } from "@/types/form/instance";
import { NStep, NTag, NSteps, NProgress, useThemeVars } from "naive-ui";
import { computeHslColor } from "@/utils/simulateHslColorOpacity";

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

  return themeVars.value.primaryColor;
});

const progressColorMode = computed(() => {
  const currentStep = props.steps[props.currentStepIndex];
  if (currentStep._status === StepStatus.PENDING) return "default";
  if (currentStep._status === StepStatus.IN_PROGRESS) return "primary";
  if (currentStep._status === StepStatus.COMPLETED) return "primary";
  if (currentStep._status === StepStatus.INVALID) return "error";
});
</script>

<template>
  <header
    v-if="formStyle?.stepperLayout.value === 'full'"
    class="flex items-center relative w-full"
  >
    <template v-for="(step, index) in steps" :key="step._index">
      <div
        class="transition-all ease-in-out duration-200 flex items-center"
        :class="{ 'flex-1': currentStepIndex === index }"
      >
        <NTag
          :key="currentStepIndex"
          class="relative tag-overlay z-10"
          round
          size="large"
          :type="
            currentStepIndex > index
              ? 'primary'
              : currentStepIndex === index
              ? progressColorMode
              : 'default'
          "
        >
          {{
            (index === currentStepIndex ? "Step " : "") + (index + 1).toString()
          }}
        </NTag>
        <div
          v-if="index === currentStepIndex"
          class="opacity-25 h-[1px] w-full bg-black w-full"
        ></div>
      </div>
      <div
        v-if="index != currentStepIndex && index != steps.length - 1"
        class="opacity-25 h-[1px] w-full bg-black w-4"
      ></div>
    </template>
  </header>

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
