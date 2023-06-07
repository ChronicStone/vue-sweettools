<template>
  <div
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="flex items-center"
  >
    <NConfigProvider
      :theme="params.theme.value"
      :theme-overrides="params.themeOverrides.value ?? null"
    >
      <div :style="{ width: `${width}px` }">
        <Component :is="RenderedCell" />
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { CellRendererParams } from "@/types/table";
import { renderVNode } from "@/utils/renderVNode.jsx";
import { useElementSize } from "@vueuse/core";
import { NConfigProvider } from "naive-ui";
import { Ref, VNodeChild, ref } from "vue";

interface JsxCellRendererProps extends CellRendererParams {
  _cellRenderer: (...args: any[]) => VNodeChild;
}

const props = defineProps<{ params: JsxCellRendererProps }>();

const cellContainerRef = ref<HTMLElement>(props.params.eGridCell);
const { width, height } = useElementSize(cellContainerRef as Ref<HTMLElement>);

const RenderedCell = renderVNode(
  props.params?._cellRenderer,
  props.params.value,
  props.params.data,
  props.params
);
</script>
