<script setup lang="tsx">
import FilterPanel from "../DataTable/FilterPanel.vue";
import SearchQueryInput from "../DataTable/SearchQueryInput.vue";
import ContextMenu from "@/components/Utils/ContextMenu.vue";
import FormRenderer from "../Form/Renderer/FormRenderer.vue";
import {
  NTooltip,
  NDropdown,
  NButton,
  NIcon,
  NSwitch,
  NPopover,
  NBadge,
  NCheckbox,
  NDivider,
} from "naive-ui";
import { TableFilter } from "@/types/table";
import { GenericObject } from "@/types/utils";
import { computed } from "vue";
import { useTableActions } from "@/composables/useTableActions";
import { useTranslations } from "@/i18n/composables/useTranslations";
import { DataListSortOption } from "@/types/datalist";
import { FormRefInstance } from "@/types/form/instance";

const { searchQuery, panelFilters, sort, selectAll } = defineModels<{
  selectAll: boolean;
  searchQuery: string;
  panelFilters: GenericObject;
  sort: { key: string; dir: "asc" | "desc" } | null;
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:panelFilters", value: GenericObject): void;
  (e: "update:sort", value: null | { key: string; dir: "asc" | "desc" }): void;
}>();

const props = defineProps<{
  listKey: string;
  nbSelected: number;
  enableSearchQuery: boolean;
  dropdownActions: ReturnType<typeof useTableActions>["value"];
  filters: TableFilter[];
  sortOptions: DataListSortOption<string>[];
  sort: { key: string; dir: "asc" | "desc" | null } | null;
  resolveGridData: () => any;
  resetTableQuery: () => any;
}>();

const i18n = useTranslations();
const controlsWrapperRef = ref<HTMLElement>();
const panelFilterRef = ref<InstanceType<typeof FilterPanel>>();

const activeControls = computed(
  () =>
    Object.values({
      filters: props.filters.length > 0,
      sort: props.sortOptions.length > 0,
      refresh: true,
    }).filter(Boolean).length
);

function resetAndReloadTable() {
  props.resetTableQuery();
  nextTick(() => props.resolveGridData());
}

const sortFormSchema = buildFormSchema({
  gridSize: 8,
  fieldSize: 8,
  fields: [
    {
      label: "Field",
      key: "key",
      type: "radio",
      gridSize: 2,
      options: () =>
        props.sortOptions.map((o) => ({ label: o.label, value: o.key })),
    },
    {
      label: "Direction",
      key: "dir",
      type: "radio",
      default: "asc",
      options: () => [
        {
          label: () => <span class="iconify" data-icon="mdi:sort-ascending" />,
          value: "asc" as const,
        },
        {
          label: () => <span class="iconify" data-icon="mdi:sort-descending" />,
          value: "desc" as const,
        },
      ],
    },
  ],
});

const formRef = ref<FormRefInstance>();
const { formData, reset } = useFormController(formRef, sortFormSchema);

async function emitSort() {
  await nextTick();
  sort.value = formData.value.key ? formData.value : null;
}
</script>

<template>
  <div
    class="flex flex-col !lg:flex-row !lg:items-center !lg:justify-between w-full gap-4"
  >
    <div class="flex flex-col gap-2">
      <div><slot /></div>
      <span
        class="text-sm text-gray-500 font-light dark:text-gray-400 flex items-center gap-1"
      >
        <NSwitch v-model:value="selectAll" size="small" />
        <NDivider vertical />
        {{ i18n.t("datatable.selectedRows", { count: props.nbSelected }) }}
      </span>
    </div>
    <div class="flex flex-col gap-3 !md:flex-row !md:items-center !md:gap-2">
      <SearchQueryInput
        v-if="enableSearchQuery"
        v-model:search-query="searchQuery"
        focus-sync
      />

      <n-dropdown
        v-if="dropdownActions?.length"
        :options="dropdownActions"
        trigger="hover"
      >
        <NButton icon-placement="right">
          <template #icon>
            <mdi:dots-horizontal />
          </template>
        </NButton>
      </n-dropdown>

      <div
        ref="controlsWrapperRef"
        class="grid md:flex gap-3 md:gap-2"
        :style="{
          gridTemplateColumns: `repeat(${activeControls}, minmax(0, 1fr))`,
        }"
      >
        <NPopover
          placement="bottom"
          :display-directive="'show'"
          trigger="click"
          style="max-width: 270px"
        >
          <template #trigger>
            <NBadge dot :show="!!sort?.key">
              <NButton class="!w-full !md:w-auto">
                <template #icon>
                  <mdi:sort v-if="!sort?.key" />
                  <mdi:sort-ascending v-else-if="sort?.dir === 'asc'" />
                  <mdi:sort-descending v-else />
                </template>
              </NButton>
            </NBadge>
          </template>
          <FormRenderer
            ref="formRef"
            :data="sort || {}"
            :schema="sortFormSchema"
          />
          <template #footer>
            <div class="flex justify-end gap-2">
              <NButton
                size="tiny"
                @click="
                  () => {
                    reset(true);
                    emitSort();
                  }
                "
              >
                {{ i18n.t("datatable.clearSort") }}
              </NButton>
              <NButton type="primary" size="tiny" @click="emitSort">
                {{ i18n.t("datatable.saveSort") }}
              </NButton>
            </div>
          </template>
        </NPopover>

        <FilterPanel
          v-if="filters?.length"
          ref="panelFilterRef"
          v-model:filters="panelFilters"
          :filters-schema="filters"
        >
          <template #default="{ active }">
            <NBadge :value="active" class="w-full md:w-auto">
              <NButton class="!w-full !md:w-auto">
                <template #icon>
                  <NIcon><mdi-filter /> </NIcon>
                </template>
              </NButton>
            </NBadge>
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
              <NButton class="!w-full !md:w-auto" @click="resolveGridData">
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
  </div>
</template>
