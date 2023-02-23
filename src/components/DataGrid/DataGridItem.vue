<script setup lang="ts">
import { useBreakpointStyle } from "@/composables/useBreakpointStyle";
import { GridItem } from "@/types/datagrid";
import { GenericObject } from "@/types/utils";
import { renderVNode } from "@/utils/renderVNode";
import { resolveFromStringPath } from "@/utils/resolveFromStringPath";
import { NSkeleton, NEllipsis } from "naive-ui";
import { computed } from "vue";

const props = defineProps<{
  fieldSchema: GridItem<any>;
  isLoading: boolean;
  data: GenericObject | null | undefined;
}>();

const fieldColSize = useBreakpointStyle(props.fieldSchema?.fieldColSize ?? "");
const fieldRowSize = useBreakpointStyle(props.fieldSchema?.fieldRowSize ?? "");

const resolvedValue = computed(() =>
  resolveFromStringPath(props.fieldSchema.key, props?.data ?? {})
);
</script>

<template>
  <div
    class="bg-red-500"
    :style="`grid-column: span ${fieldColSize} / span ${fieldColSize}; grid-row: span ${fieldRowSize} / span ${fieldRowSize}`"
  >
    <template v-if="isLoading">
      <NSkeleton :class="fieldRowSize > 1 ? 'h-full' : 'h-10'" :sharp="false" />
    </template>

    <template v-else>
      <div class="flex flex-col gap-1 w-auto">
        <span v-if="fieldSchema?.label" class="font-semibold flex items-center">
          <Component
            :is="renderVNode(fieldSchema.label, resolvedValue, data)"
          />:
        </span>

        <div v-if="!fieldSchema.render">
          {{ resolvedValue }}
        </div>

        <div v-else>
          <Component
            :is="renderVNode(fieldSchema.render, resolvedValue, data)"
          />
        </div>
      </div>
    </template>
  </div>
</template>
