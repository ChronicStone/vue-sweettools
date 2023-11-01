<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider :theme="theme" :theme-overrides="themeOverrides ?? null">
      <div :style="{ width: `${width}px` }">
        <div
          class="ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper overflow-visible"
          :class="{
            'ag-checked': rowSelected || selectAll,
            'ag-disabled cursor-not-allowed': selectAll,
          }"
        >
          <input
            v-model="rowSelected"
            type="checkbox"
            class="ag-input-field-input ag-checkbox-input"
            :disabled="selectAll"
            @click="handleSelection($event)"
          />
        </div>
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { NConfigProvider } from "naive-ui";
import { useElementSize } from "@vueuse/core";
import { CellRendererParams } from "@/types/table";
import { type Ref } from "vue";
import { RowNode } from "ag-grid-community";

interface JsxCellRendererProps extends CellRendererParams {
  getSelectAll: () => boolean;
  getLastSelectedNode: () => RowNode | null;
  setLastSelectedNode: (node: RowNode) => void;
}

const props = defineProps<{ params: JsxCellRendererProps }>();
const cellContainerRef = ref<HTMLElement>(props.params.eGridCell);
const { width } = useElementSize(cellContainerRef as Ref<HTMLElement>);

const theme = computed(() => props.params.getTheme());
const themeOverrides = computed(() => props.params.getThemeOverrides());

const selectAll = computed(props.params.getSelectAll);
const rowSelected = ref<boolean>(props.params.node.isSelected() ?? false);
const lastSelectedNode = computed(props.params.getLastSelectedNode);
watch(
  () => rowSelected.value,
  (v) => props.params.node.setSelected(v)
);

props.params.node.addEventListener(
  "rowSelected",
  () => (rowSelected.value = props.params.node.isSelected() ?? false)
);

onUnmounted(() =>
  props.params.node.removeEventListener(
    "rowSelected",
    () => (rowSelected.value = props.params.node.isSelected() ?? false)
  )
);

function handleSelection(event: MouseEvent) {
  if (rowSelected.value || !event.shiftKey || !lastSelectedNode.value) return;
  const indexRange = [
    lastSelectedNode.value.rowIndex!,
    props.params.node.rowIndex!,
  ].sort((a, b) => a - b);
  for (let i = indexRange[0]; i <= indexRange[1]; i++)
    props.params.api?.getDisplayedRowAtIndex(i)?.setSelected(true);
}

watch(
  () => rowSelected.value,
  () => {
    if (selectAll.value) return;
    props.params.setLastSelectedNode(props.params.node);
  }
);
</script>
