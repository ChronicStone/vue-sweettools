<script setup lang="ts">
import { useIsMobile } from "@/composables/useIsMobile";
import { GridControls } from "@/types/table";
import { NSelect, NPagination } from "naive-ui";
import { computed } from "vue";

const emit = defineEmits<{
  (e: "update:paginationState", value: GridControls["pagination"]): void;
}>();

const props = defineProps<{
  paginationState: GridControls["pagination"];
}>();

const isMobile = useIsMobile();

const _paginationState = computed({
  get: () => props.paginationState,
  set: (value: GridControls["pagination"]) =>
    emit("update:paginationState", value),
});
</script>

<template>
  <div
    class="flex w-full flex-col !md:flex-row !md:justify-between !md:items-center gap-4"
  >
    <div
      class="flex items-center w-full gap-3 justify-between !md:justify-start"
    >
      <NSelect
        v-model:value="_paginationState.pageSize"
        class="max-w-32"
        placeholder="Page size"
        :options="
          [50, 100, 250, 500].map((i) => ({ label: `${i} rows`, value: i }))
        "
      />
      <span>
        {{
          _paginationState.pageSize * _paginationState.pageIndex -
          (_paginationState.pageSize - 1)
        }}
        -
        {{ _paginationState.pageSize * _paginationState.pageIndex }}
        of {{ _paginationState.rowTotalCount }}</span
      >
    </div>
    <div class="w-full flex justify-center !md:justify-end">
      <n-pagination
        v-model:page="_paginationState.pageIndex"
        :page-count="_paginationState.pageTotalCount"
        :page-sizes="[10, 20, 30, 40]"
        :page-slot="isMobile ? 3 : 8"
      />
    </div>
  </div>
</template>
