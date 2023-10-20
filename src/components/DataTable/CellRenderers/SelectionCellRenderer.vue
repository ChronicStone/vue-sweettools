<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider
      :theme="params.theme.value"
      :theme-overrides="params.themeOverrides.value ?? null"
    >
      <div :style="{ width: `${width}px` }">
        <div
          class="ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper overflow-visible"
          :class="{
            'ag-checked': rowSelected || params.selectAll.value,
            'ag-disabled cursor-not-allowed': params.selectAll.value,
          }"
        >
          <input
            v-model="rowSelected"
            type="checkbox"
            class="ag-input-field-input ag-checkbox-input"
            :disabled="params.selectAll.value"
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

interface JsxCellRendererProps extends CellRendererParams {
  selectAll: Ref<boolean>;
}

const props = defineProps<{ params: JsxCellRendererProps }>();
const cellContainerRef = ref<HTMLElement>(props.params.eGridCell);
const { width } = useElementSize(cellContainerRef as Ref<HTMLElement>);

const rowSelected = ref<boolean>(props.params.node.isSelected() ?? false);
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
</script>
