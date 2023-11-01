<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider :theme="theme" :theme-overrides="themeOverrides ?? null">
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
import { Ref, defineComponent, ref } from "vue";

interface CustomCellRendererProps extends CellRendererParams {
  _cellRenderer: ReturnType<typeof defineComponent>;
}

const props = defineProps<{ params: CustomCellRendererProps }>();
const theme = computed(() => props.params.getTheme());
const themeOverrides = computed(() => props.params.getThemeOverrides());

const cellContainerRef = ref<HTMLElement>(props.params.eGridCell);
const { width } = useElementSize(cellContainerRef as Ref<HTMLElement>);
</script>
