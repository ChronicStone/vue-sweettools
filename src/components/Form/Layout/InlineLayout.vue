<script setup lang="ts">
const formStyles = useFormStyles();
</script>

<template>
  <div class="flex flex-col gap-4">
    <slot name="header" />
    <form
      class="h-full grid gap-4 overflow-y-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full text-left"
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

    <div
      v-if="$slots.actions"
      class="h-1/12 flex w-full justify-center items-center gap-4 pt-6"
    >
      <slot name="actions" />
    </div>

    <div v-if="$slots.customActions">
      <slot name="customActions" />
    </div>
  </div>
</template>
