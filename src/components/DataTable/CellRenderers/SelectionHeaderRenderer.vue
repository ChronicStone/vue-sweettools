<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider
      :theme="params.theme.value"
      :theme-overrides="params.themeOverrides.value ?? null"
    >
      <div :style="{ width: `${width}px` }">
        <NCheckbox
          :checked="selectAll"
          :on-update:checked="(value) => (selectAll = value)"
          size="large"
        />
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { NConfigProvider, NCheckbox } from "naive-ui";
import { useElementSize } from "@vueuse/core";
import { ref, watch } from "vue";
import { HeaderRendererParams } from "@/types/table";

interface JsxCellRendererProps extends HeaderRendererParams {
  setGlobalSelection: (val: boolean) => void;
}

const props = defineProps<{ params: JsxCellRendererProps }>();
const cellContainerRef = ref<HTMLElement>(props.params.eGridHeader);
const { width } = useElementSize(cellContainerRef);

const selectAll = ref<boolean>(false);
watch(
  () => selectAll.value,
  (val) => props.params.setGlobalSelection(val)
);
</script>
