<script setup lang="ts">
import { NCard, NScrollbar } from 'naive-ui'
import type { FormSchema } from '@/form/types/form'

const props = defineProps<{ schema: FormSchema }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const formStyles = useFormStyles()
const disableOverflow = ref<boolean>(false)

const { currentStep } = useFormFields()
const globalConfig = useGlobalConfig(props.schema)

const activeTransition = ref<'slide-fade-reverse' | 'slide-fade'>(
  'slide-fade-reverse',
)
const _currentStep = ref<number>(currentStep.value)
watch(
  () => currentStep.value,
  (newIndex) => {
    activeTransition.value
      = newIndex > _currentStep.value ? 'slide-fade-reverse' : 'slide-fade'
    nextTick(() => (_currentStep.value = newIndex))
  },
)

onMounted(() => document.body.classList.add('overflow-hidden'))
onUnmounted(() => document.body.classList.remove('overflow-hidden'))
</script>

<template>
  <Transition name="scale" appear>
    <NCard
      class="transition-all opacity-100 rounded-lg !w-screen !h-screen !rounded-none fixed top-0 left-0"
      :content-style="{
        height: 'fit-content',
        maxHeight: formStyles.maxHeight.value,
        width: '100%',
        padding: '10px',
        display: 'flex',
      }"
      :header-style="{
        paddingTop: '25px',
      }"
    >
      <template #header>
        <div class="flex flex-col gap-4">
          <slot name="title" />
          <slot name="stepper" />
        </div>
      </template>

      <div
        v-if="globalConfig.getProp('uiConfig.showCloseButton')"
        class="absolute top-2 right-2 h-5 w-5 rounded-full cursor-pointer grid place-items-center hover:(bg-gray-500 bg-opacity-20 text-red-500)"
        @click="emit('close')"
      >
        <mdi:close class="h-4 w-4" />
      </div>

      <NScrollbar
        style="max-height: 77.5vh; width: 100%"
        class="px-6 text-left overflow-visible"
      >
        <Transition
          :name="activeTransition"
          mode="out-in"
          @before-enter="disableOverflow = true"
          @after-appear="disableOverflow = false"
        >
          <div :key="currentStep" class="grid" style="grid-template-rows: 1fr">
            <form
              class="w-full h-full pb-4 grid gap-4 overflow-visible"
              :style="`height:fit-content !important;${formStyles.gridSize.value}`"
            >
              <slot name="fields" />
            </form>
          </div>
        </Transition>
      </NScrollbar>

      <template #footer>
        <div
          class="flex w-full h-[fit-content] justify-end items-center gap-4 pt-6"
        >
          <slot name="actions" />
        </div>
      </template>
    </NCard>
  </Transition>
</template>

<style>
.scale-move,
.scale-enter-active,
.scale-leave-active {
  transition: all ease-in-out 0.15s;
}

.scale-leave-active {
  position: absolute;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.005s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
