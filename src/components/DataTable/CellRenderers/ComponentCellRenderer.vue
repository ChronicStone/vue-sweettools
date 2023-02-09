<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider
      :theme="params.theme.value"
      :theme-overrides="params.themeOverrides.value ?? null"
    >
      <div :style="{ width: `${width}px` }" class="flex">
        <component :is="params._cellRenderer" v-bind="$props" />
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { NConfigProvider } from "naive-ui";
import { CellRendererParams } from "@/types/table";
import { useElementSize } from "@vueuse/core";
import { defineComponent, ref } from "vue";

interface CustomCellRendererProps extends CellRendererParams {
  _cellRenderer: ReturnType<typeof defineComponent>;
}

const props = defineProps<{ params: CustomCellRendererProps }>();
const cellContainerRef = ref<HTMLElement>(props.params.eGridCell);
const { width } = useElementSize(cellContainerRef);
</script>
