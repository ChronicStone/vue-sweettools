<script setup lang="tsx" generic="T extends (...args: any[]) => VNodeChild">
import type { VNodeChild } from "vue";

const props = defineProps<{
  renderer: T;
  params?: Parameters<T>;
}>();
</script>

<template>
  <!-- @vue-expect-error Weird inferrence of expected props for passed render funct -->
  <component :is="renderVNode($props.renderer, ...(params as any[] ?? []))" />
</template>
