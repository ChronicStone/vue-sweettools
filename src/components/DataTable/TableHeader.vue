<script setup lang="ts">
import FilterPanel from "./FilterPanel.vue";
import SearchQueryInput from "./SearchQueryInput.vue";
import { NTooltip, NDropdown, NButton, NIcon } from "naive-ui";
import { useDropdownActions } from "@/composables/useDropdownActions";
import { TableFilter } from "@/types/table";
import { GenericObject } from "@/types/utils";
import { computed } from "vue";

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:panelFilters", value: GenericObject): void;
}>();

const props = defineProps<{
  tableKey: string;
  nbSelected: number;
  enableSearchQuery: boolean;
  searchQuery: string;
  panelFilters: GenericObject;
  dropdownActions: ReturnType<typeof useDropdownActions>["value"];
  filters: TableFilter[];
  resolveGridData: (...args: any[]) => void;
}>();

const _searchQuery = computed({
  get: () => props.searchQuery,
  set: (value: string) => emit("update:searchQuery", value),
});

const _panelFilters = computed({
  get: () => props.panelFilters,
  set: (value: GenericObject) => emit("update:panelFilters", value),
});
</script>

<template>
  <div
    class="flex flex-col !lg:flex-row !lg:items-center !lg:justify-between w-full gap-4"
  >
    <div class="flex flex-col gap-1">
      <div><slot /></div>
      <span class="text-sm text-gray-500 font-light dark:text-gray-400">
        {{ nbSelected }} selected
      </span>
    </div>
    <div class="flex flex-col gap-4 !md:flex-row !md:items-center !md:gap-3">
      <SearchQueryInput v-model:search-query="_searchQuery" focus-sync />

      <n-dropdown
        v-if="dropdownActions?.length"
        :options="dropdownActions"
        trigger="hover"
      >
        <NButton secondary type="primary" icon-placement="right">
          Actions
          <template #icon>
            <NIcon> <i:mdi-chevron-down /> </NIcon>
          </template>
        </NButton>
      </n-dropdown>

      <FilterPanel
        v-if="filters?.length"
        v-model:filters="_panelFilters"
        :filters-schema="filters"
      >
        <template #default="{ active }">
          <NButton
            v-if="active < 1"
            secondary
            type="primary"
            class="w-full !md:w-auto"
          >
            <template #icon>
              <NIcon> <i:mdi-filter /> </NIcon>
            </template>
          </NButton>
          <NButton v-else secondary type="primary" class="w-full !md:w-auto">
            <template #icon>
              <NIcon><i:mdi-filter /> </NIcon>
            </template>
            ({{ active }})
          </NButton>
        </template>
      </FilterPanel>

      <NTooltip>
        <template #trigger>
          <NButton secondary type="primary" @click="resolveGridData">
            <template #icon>
              <NIcon>
                <i:mdi-refresh />
              </NIcon>
            </template>
          </NButton>
        </template>
        Refresh data
      </NTooltip>
    </div>
  </div>
</template>
