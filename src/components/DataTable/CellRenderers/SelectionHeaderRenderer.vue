<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider :theme="theme" :theme-overrides="themeOverrides ?? null">
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
import { Ref, ref, watch } from "vue";
import { HeaderRendererParams } from "@/types/table";

interface JsxCellRendererProps extends HeaderRendererParams {
  setGlobalSelection: (val: boolean) => void;
}

const theme = computed(() => props.params.getTheme());
const themeOverrides = computed(() => props.params.getThemeOverrides());

const props = defineProps<{ params: JsxCellRendererProps }>();
const cellContainerRef = ref<HTMLElement>(props.params.eGridHeader);
const { width } = useElementSize(cellContainerRef as Ref<HTMLElement>);

const selectAll = ref<boolean>(false);
watch(
  () => selectAll.value,
  (val) => props.params.setGlobalSelection(val)
);
</script>
