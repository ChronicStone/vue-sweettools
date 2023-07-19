<script setup lang="ts">
import { useBreakpointStyle } from "@/composables/useBreakpointStyle";
import { GridItem } from "@/types/datagrid";
import { GenericObject } from "@/types/utils";
import { renderVNode } from "@/utils/renderVNode.jsx";
import { resolveFromStringPath } from "@/utils/resolveFromStringPath";
import { NSkeleton, NEllipsis } from "naive-ui";
import { computed } from "vue";

const props = defineProps<{
  virtualStore: Record<string, unknown>;
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
    :style="`grid-column: span ${fieldColSize} / span ${fieldColSize}; grid-row: span ${fieldRowSize} / span ${fieldRowSize};`"
  >
    <template v-if="isLoading">
      <NSkeleton
        :class="+fieldRowSize > 1 ? 'h-full' : 'h-10'"
        :sharp="false"
      />
    </template>

    <template v-else>
      <div class="flex flex-col gap-1 w-full h-full">
        <div v-if="fieldSchema?.label" class="font-semibold flex items-center">
          <component :is="() => renderVNode(fieldSchema.label, data)" />:
        </div>

        <div class="w-[fit-content]">
          <template v-if="!fieldSchema.render">
            {{ resolvedValue || "N/A" }}
          </template>

          <component
            :is="
              () =>
                renderVNode(fieldSchema.render, {
                  value: resolvedValue,
                  data,
                  store: virtualStore,
                })
            "
            v-else
          />
        </div>
      </div>
    </template>
  </div>
</template>
