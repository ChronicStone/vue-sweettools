<script setup lang="ts">
import { NCard, NScrollbar } from "naive-ui";
const formStyles = useFormStyles();
</script>

<template>
  <NCard
    id="sweetforms__form"
    ref="formRef"
    :style="{ maxWidth: formStyles.maxWidth.value, width: '100%' }"
    class="transition-all opacity-100 fixed w-9/10 md:w-3/4 lg:w-1/2 rounded-lg h-auto"
    :content-style="{
      height: 'fit-content',
      maxHeight: formStyles.maxHeight.value,
      width: '100%',
      padding: '10px',
    }"
  >
    <template #header>
      <slot name="header" />
    </template>

    <NScrollbar
      style="max-height: 55vh; width: 100%"
      class="max-h-55vh px-6 text-left"
    >
      <div
        class="w-full h-full pb-4 grid gap-4"
        :style="`height:fit-content !important;${formStyles.gridSize.value}`"
      >
        <slot name="fields" />
      </div>
    </NScrollbar>

    <template #footer>
      <div
        class="flex w-full h-[fit-content] justify-center items-center gap-4 pt-6"
      >
        <slot name="actions" />
      </div>
    </template>
  </NCard>
</template>
