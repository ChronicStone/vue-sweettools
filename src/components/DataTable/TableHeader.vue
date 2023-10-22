<script setup lang="ts">
import FilterPanel from "./FilterPanel.vue";
import SearchQueryInput from "./SearchQueryInput.vue";
import ContextMenu from "@/components/Utils/ContextMenu.vue";
import { NTooltip, NDropdown, NButton, NIcon, useThemeVars } from "naive-ui";
import { useDropdownActions } from "@/composables/useDropdownActions";
import { TableFilter } from "@/types/table";
import { GenericObject } from "@/types/utils";
import { computed } from "vue";
import { useTableActions } from "@/composables/useTableActions";
import { useTranslations } from "@/i18n/composables/useTranslations";

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
  dropdownActions: ReturnType<typeof useTableActions>["value"];
  filters: TableFilter[];
  resolveGridData: () => any;
  resetTableQuery: () => any;
}>();

const i18n = useTranslations();

const _searchQuery = computed({
  get: () => props.searchQuery,
  set: (value: string) => emit("update:searchQuery", value),
});

const _panelFilters = computed({
  get: () => props.panelFilters,
  set: (value: GenericObject) => emit("update:panelFilters", value),
});

const themeVars = useThemeVars();
function getAnimationColor(opacity: number) {
  const _color = themeVars.value.primaryColor;
  return computeHslColor(_color, opacity);
}

function resetAndReloadTable() {
  props.resetTableQuery();
  nextTick(() => props.resolveGridData());
}
</script>

<template>
  <div
    class="flex flex-col !lg:flex-row !lg:items-center !lg:justify-between w-full gap-4"
  >
    <div class="flex flex-col gap-1">
      <div><slot /></div>
      <span class="text-sm text-gray-500 font-light dark:text-gray-400">
        {{ i18n.t("datatable.selectedRows", { count: props.nbSelected }) }}
      </span>
    </div>
    <div class="flex flex-col gap-4 !md:flex-row !md:items-center !md:gap-3">
      <SearchQueryInput
        v-if="enableSearchQuery"
        v-model:search-query="_searchQuery"
        focus-sync
      />

      <n-dropdown
        v-if="dropdownActions?.length"
        :options="dropdownActions"
        trigger="hover"
      >
        <NButton secondary type="primary" icon-placement="right">
          Actions
          <template #icon>
            <NIcon> <mdi-chevron-down /> </NIcon>
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
              <NIcon> <mdi-filter /> </NIcon>
            </template>
          </NButton>
          <NButton
            v-else
            secondary
            type="primary"
            class="w-full !md:w-auto animate-pulse"
          >
            <template #icon>
              <NIcon><mdi-filter /> </NIcon>
            </template>
            ({{ active }})
          </NButton>
        </template>
      </FilterPanel>

      <NTooltip>
        <template #trigger>
          <ContextMenu
            :actions="[
              {
                label: i18n.t('datatable.refreshAndResetAction'),
                icon: 'material-symbols:filter-alt-off-outline',
                action: resetAndReloadTable,
              },
            ]"
          >
            <NButton secondary type="primary" @click="resolveGridData">
              <template #icon>
                <NIcon>
                  <mdi-refresh />
                </NIcon>
              </template>
            </NButton>
          </ContextMenu>
        </template>
        {{ i18n.t("datatable.refreshButtonTooltip") }}
      </NTooltip>
    </div>
  </div>
</template>
