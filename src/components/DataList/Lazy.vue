<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { ref, nextTick, onUnmounted } from "vue";

// Props declaration with type inference
const props = defineProps<{
  renderOnIdle?: boolean;
  unrender?: boolean;
  minHeight: number;
  unrenderDelay?: number;
  identifier: string;
}>();

// Reactive references
const shouldRender = ref(false);
const targetEl = ref<HTMLElement | null>(null);
const fixedMinHeight = ref(0);

// Timers
let unrenderTimer: NodeJS.Timeout | undefined;
let renderTimer: NodeJS.Timeout | undefined;

// Intersection Observer
const { stop } = useIntersectionObserver(
  targetEl,
  ([{ isIntersecting }]) => {
    if (!targetEl.value) return;
    if (isIntersecting) {
      // perhaps the user re-scrolled to a component that was set to unrender. In that case stop the unrendering timer
      clearTimeout(unrenderTimer);
      // if we're dealing underndering lets add a waiting period of 200ms before rendering. If a component enters the viewport and also leaves it within 200ms it will not render at all. This saves work and improves performance when user scrolls very fast
      if (props.unrender) {
        renderTimer = setTimeout(
          () => (shouldRender.value = true),
          props.unrender ? 200 : 0
        );
      } else {
        shouldRender.value = true;
      }

      if (!props.unrender) {
        stop();
      }
    } else if (props.unrender) {
      // if the component was set to render, cancel that
      clearTimeout(renderTimer);
      unrenderTimer = setTimeout(() => {
        fixedMinHeight.value = targetEl.value!.clientHeight;
        shouldRender.value = false;
      }, props.unrenderDelay);
    }
  },
  {
    rootMargin: "600px",
  }
);

// Idle callback
function onIdle(cb: () => void) {
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(cb);
  } else {
    setTimeout(() => {
      nextTick(cb);
    }, 300);
  }
}

if (props.renderOnIdle) {
  onIdle(() => {
    shouldRender.value = true;
    if (!props.unrender) {
      stop();
    }
  });
}

// watch(
//   () => shouldRender.value,
//   (value) => {
//     if (value)
//       console.info(
//         value ? "rendering" : "unrendering" + " " + props.identifier
//       );
//     else console.warn("unrendering" + " " + props.identifier);
//   }
// );

// Cleanup timers on unmount
onUnmounted(() => {
  clearTimeout(unrenderTimer);
  clearTimeout(renderTimer);
});
</script>

<template>
  <div
    ref="targetEl"
    :style="`min-height:${fixedMinHeight || props.minHeight}px`"
  >
    <slot v-if="shouldRender" />
  </div>
</template>
