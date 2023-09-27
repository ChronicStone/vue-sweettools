<template>
  <div
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="flex items-center"
    @click="toggleSort"
  >
    <NConfigProvider
      :theme="params.theme.value"
      :theme-overrides="params.themeOverrides.value ?? null"
    >
      <div :style="{ width: `${width}px` }">
        <strong>Hi</strong>
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { HeaderRendererParams } from "@/types/table";
import { useElementSize } from "@vueuse/core";
import { NConfigProvider } from "naive-ui";
import { Ref, ref } from "vue";

interface CellHeaderRendererProps extends HeaderRendererParams {
  label: string;
  searchable: boolean;
}

const props = defineProps<{ params: CellHeaderRendererProps }>();

const cellContainerRef = ref<HTMLElement>(props.params.eGridHeader);
const { width, height } = useElementSize(cellContainerRef as Ref<HTMLElement>);

const sortMode = ref<"asc" | "desc" | null>(
  props.params.column.getSort() ?? null
);

function toggleSort() {
  if (sortMode.value === "asc") return props.params.column.setSort("desc");
  else if (sortMode.value === "desc") return props.params.column.setSort(null);
  else props.params.column.setSort("asc", "uiColumnSorted");
}

props.params.column.addEventListener(
  "sortChanged",
  () => (sortMode.value = props.params.column.getSort() ?? null)
);
</script>
