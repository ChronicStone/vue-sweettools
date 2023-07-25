<script setup lang="ts">
import { FormSchema } from "@/types/form/form";

const formStyles = useFormStyles();
const { currentStep } = useFormFields();

const formRef = ref<HTMLFormElement>();
const disableOverflow = ref<boolean>(false);

const props = defineProps<{ schema: FormSchema }>();
const emit = defineEmits<{ (e: "close"): void }>();

const activeTransition = ref<"slide-fade-reverse" | "slide-fade">(
  "slide-fade-reverse"
);
const _currentStep = ref<number>(currentStep.value);
watch(
  () => currentStep.value,
  (newIndex) => {
    activeTransition.value =
      newIndex > _currentStep.value ? "slide-fade-reverse" : "slide-fade";
    nextTick(() => (_currentStep.value = newIndex));
  }
);
</script>

<template>
  <div
    class="flex flex-col gap-4 relative"
    :class="{ 'overflow-hidden': disableOverflow }"
  >
    <slot name="stepper" />
    <Transition
      :name="activeTransition"
      mode="out-in"
      @before-enter="disableOverflow = true"
      @after-appear="disableOverflow = false"
    >
      <div :key="_currentStep" class="grid" style="grid-template-rows: 1fr">
        <form
          ref="formRef"
          class="h-full grid gap-4 overflow-visible text-left transition-all ease-in-out duration-150"
          :style="`${formStyles?.gridSize.value}`"
          :class="{
            'max-h-10/12': $slots.header && $slots.footer,
            'max-h-11/12':
              ($slots.header && !$slots.footer) ||
              ($slots.footer && !$slots.header),
            'max-h-full': $slots.header && $slots.footer,
          }"
        >
          <slot name="fields" />
        </form>
      </div>
    </Transition>
  </div>
</template>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.15s, transform 0.1s;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30%);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30%);
}

.slide-fade-reverse-enter-active,
.slide-fade-reverse-leave-active {
  transition: opacity 0.15s, transform 0.1s;
}
.slide-fade-reverse-enter-from {
  opacity: 0;
  transform: translateX(30%);
}

.slide-fade-reverse-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
</style>
