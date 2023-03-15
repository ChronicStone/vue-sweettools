<script setup lang="ts">
import { FormSchema } from "@/types/form/form";

const formStyles = useFormStyles();
const { currentStep } = useFormFields();

const formRef = ref<HTMLFormElement>();
const disableOverflow = ref<boolean>(false);
const tempHeight = ref<number | false>(0);

const props = defineProps<{ schema: FormSchema }>();
const emit = defineEmits<{ (e: "close"): void }>();

watch(
  () => currentStep.value,
  async (newStep, oldStep) => {
    disableOverflow.value = true;
    await simulateSlideForm(newStep > oldStep ? "left" : "right");
    disableOverflow.value = false;
  }
);

const sleep = (d: number) => new Promise((r, rj) => setTimeout(() => r(d), d));

async function simulateSlideForm(direction: "left" | "right") {
  if (!formRef.value) return;

  const form = formRef.value as HTMLElement;
  const formBounding = formRef.value.getBoundingClientRect();
  tempHeight.value = formBounding.height;

  await nextTick();
  await sleep(50);

  form.style.visibility = "hidden";
  form.style.transform = `translateX(${
    direction === "left" ? "-100%" : "100%"
  })`;
  form.style.transitionDuration = "0";

  await sleep(50);
  await nextTick();

  form.style.opacity = "1";
  form.style.transform = `translateX(${
    direction === "left" ? "100%" : "-100%"
  })`;
  form.style.transitionDuration = "0.15s";

  await sleep(50);
  await nextTick();

  form.style.visibility = "visible";
  form.style.transform = "translateX(0)";
}
</script>

<template>
  {{ disableOverflow }}
  <div
    class="flex flex-col gap-4 relative"
    :class="{ 'overflow-hidden': disableOverflow }"
  >
    <slot name="stepper" />

    <form
      ref="formRef"
      class="h-full grid gap-4 overflow-visible text-left transition-transform ease-in-out duration-150"
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
  transition: opacity 0.15s, transform 0.2s;
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
