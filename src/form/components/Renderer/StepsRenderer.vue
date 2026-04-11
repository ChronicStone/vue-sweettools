<script setup lang="ts">
import {
  NEllipsis,
  NProgress,
  NTag,
  useThemeVars,
} from 'naive-ui'
import { type StepInstance, StepStatus } from '../../types/instance'

const props = defineProps<{
  steps: StepInstance[]
  currentStepIndex: number
}>()

const i18n = useTranslations()
const formStyle = useFormStyles()
const themeVars = useThemeVars()
const progressPercent = computed(
  () => ((props.currentStepIndex + 1) / props.steps.length) * 100,
)
const currentStep = computed(() => props.steps[props.currentStepIndex])

const progressColor = computed(() => {
  const currentStep = props.steps[props.currentStepIndex]
  if (currentStep._status === StepStatus.PENDING)
    return themeVars.value.modalColor
  if (currentStep._status === StepStatus.IN_PROGRESS)
    return themeVars.value.primaryColor
  if (currentStep._status === StepStatus.COMPLETED)
    return themeVars.value.successColor
  if (currentStep._status === StepStatus.INVALID)
    return themeVars.value.errorColor

  return themeVars.value.primaryColor
})

// const progressColorMode = computed(() => {
//   const currentStep = props.steps[props.currentStepIndex]
//   if (currentStep._status === StepStatus.PENDING)
//     return 'default'
//   if (currentStep._status === StepStatus.IN_PROGRESS)
//     return 'primary'
//   if (currentStep._status === StepStatus.COMPLETED)
//     return 'success'
//   if (currentStep._status === StepStatus.INVALID)
//     return 'error'

//   return 'default'
// })

function progressColorMode(stepIndex: number) {
  const currentStep = props.steps[stepIndex]
  if (currentStep._status === StepStatus.PENDING)
    return 'default'
  if (currentStep._status === StepStatus.IN_PROGRESS)
    return 'primary'
  if (currentStep._status === StepStatus.COMPLETED)
    return 'success'
  if (currentStep._status === StepStatus.INVALID)
    return 'error'

  return 'default'
}
</script>

<template>
  <header
    v-if="formStyle?.stepperLayout.value === 'full'"
    class="flex items-center relative w-full"
  >
    <template v-for="(step, index) in steps" :key="step._index">
      <div
        class="transition-all ease-in-out duration-200 flex items-center"
        :class="{
          'ml-auto': (currentStepIndex + 1 === index || index === steps.length - 1),
          'w-full': (currentStepIndex === index && index !== steps.length - 1) || (index === currentStepIndex && index === steps.length - 1),
        }"
      >
        <div
          v-if="index === currentStepIndex && index === steps.length - 1"
          class="opacity-25 h-[1px] bg-black dark:bg-gray-100 w-full"
        />
        <NTag
          :key="currentStepIndex"
          class="relative tag-overlay z-10"
          round
          size="large"
          :type="
            progressColorMode(index)
          "
        >
          <NEllipsis>
            <div class="flex items-center gap-1">
              <span v-if="step.icon" class="iconify" :data-icon="step.icon" />
              <span v-else-if="currentStepIndex !== index">{{ index + 1 }}</span>
              <template v-if="currentStepIndex === index">
                <span v-if="!step.title">
                  {{
                    i18n.t("form.layout.multiStep.stepTitle", { index: index + 1 })
                  }}
                </span>
                <span v-else>
                  <component :is="renderVNode(step.title)" />
                </span>
              </template>
            </div>
          </NEllipsis>
        </NTag>
        <div
          v-if="index < steps.length - 1"
          class="opacity-25 h-[1px] bg-black dark:bg-gray-100"
          :class="{
            'w-full': currentStepIndex === index,
            'w-4': currentStepIndex !== index,
          }"
        />
      </div>
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
      <h1 class="text-center uppercase text-xl">
        {{ currentStep.title }}
      </h1>
    </div>
  </div>
</template>
