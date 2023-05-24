<template>
  <div
    v-if="mappedSchema?.length"
    class="grid gap-4 auto-rows-min"
    :style="`${_gridColSize} ${_gridRowSize}`"
  >
    <DataGridItem
      v-for="(field, index) in mappedSchema"
      :key="index"
      :virtual-store="virtualStore"
      :field-schema="field"
      :data="data"
      :is-loading="isLoading"
    />
  </div>

  <div v-else class="w-full grid place-items-center">
    <NEmpty />
  </div>
</template>

<script setup lang="ts">
import DataGridItem from "./DataGridItem.vue";
import { NEmpty } from "naive-ui";
import { resolveFromStringPath } from "@/utils/resolveFromStringPath";
import { computed } from "vue";
import { GenericObject } from "@/types/utils";
import { useBreakpointStyle } from "@/composables/useBreakpointStyle";
import { DataGridProps } from "@/types/datagrid";

const props = defineProps<DataGridProps>();

const isLoading = computed<boolean>(() => !props.data);

const _gridRowSize = useBreakpointStyle(props?.gridRowSize ?? "1", "grid-rows");
const _gridColSize = useBreakpointStyle(
  props?.gridColSize ?? "1 md:3 lg:4 xl:5",
  "grid-cols"
);

const virtualStore = asyncComputed<Record<string, unknown>>(() => {
  if (!Object.keys(props.virtualStore ?? {}).length) return false;
  return Object.entries(props.virtualStore ?? {}).reduce(
    async (acc, [key, item]) => {
      return {
        ...acc,
        [key]:
          typeof item.value === "function" ? await item.value() : item.value,
      };
    },
    {}
  );
}, {});

const mappedSchema = computed(
  () =>
    props.fields?.filter(Boolean).filter((item) => {
      if (!item.condition) return item;
      else
        return item.condition({
          value: resolveFromStringPath(
            item.key,
            (props?.data ?? {}) as GenericObject
          ),
          data: props?.data ?? {},
          store: virtualStore.value,
        });
    }) ?? []
);
</script>
