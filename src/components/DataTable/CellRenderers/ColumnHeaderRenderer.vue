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
      <div
        :style="{ width: `${width}px` }"
        class="flex items-center gap-2 justify-between"
      >
        <strong>
          <Component :is="renderVNode(params.label)" />
        </strong>
        <div class="flex items-center gap-1">
          <NTooltip v-if="params.searchable">
            <template #trigger>
              <mdi:magnify class="text-gray-500" />
            </template>
            This column is searchable through quick search
          </NTooltip>
          <mdi:arrow-up
            v-if="sortMode"
            :style="{ color: themeVars.primaryColor }"
            class="transform transition-all duration-100"
            :class="{ 'rotate-180': sortMode === 'desc' }"
          />
        </div>
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { HeaderRendererParams } from "@/types/table";
import { useElementSize } from "@vueuse/core";
import { ColumnState } from "ag-grid-community";
import { NConfigProvider, NTooltip, useThemeVars } from "naive-ui";
import { VNodeChild } from "vue";
import { Ref, ref } from "vue";

interface CellHeaderRendererProps extends HeaderRendererParams {
  label: string | (() => VNodeChild);
  searchable: boolean;
}

const themeVars = useThemeVars();
const props = defineProps<{ params: CellHeaderRendererProps }>();
const cellContainerRef = ref<HTMLElement>(props.params.eGridHeader);
const { width, height } = useElementSize(cellContainerRef as Ref<HTMLElement>);

const sortMode = ref<"asc" | "desc" | null>(
  props.params.column.getSort() ?? null
);

function toggleSort() {
  props.params.columnApi?.applyColumnState({
    state: [
      ...(props.params.columnApi.getColumns() ?? []).map((c) => ({
        colId: c.getColId(),
        sort:
          props.params.column.getColId() !== c.getColId()
            ? null
            : sortMode.value === "asc"
            ? "desc"
            : sortMode.value === "desc"
            ? null
            : "asc",
      })),
    ] as ColumnState[],
  });
}

props.params.column.addEventListener(
  "sortChanged",
  () => (sortMode.value = props.params.column.getSort() ?? null)
);
</script>
