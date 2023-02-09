<script setup lang="ts">
import { onKeyPressed, useWindowSize } from "@vueuse/core";
import { NTooltip, NButton, NDrawer, NDrawerContent, NIcon } from "naive-ui";
import { Form, FormRefInstance } from "@chronicstone/vue-sweetforms";
import { computed, ref } from "vue";
import { TableFilter } from "@/types/table";
import { GenericObject } from "@/types/utils";
import { mapFiltersToFormSchema } from "@/utils/table/mapFiltersToFormSchema.js";

const emit = defineEmits<{
  (e: "update:filters", value: GenericObject): void;
}>();

const props = defineProps<{
  filtersSchema: TableFilter[];
  filters: GenericObject;
}>();

const { width } = useWindowSize();
const isPanelOpen = ref<boolean>(false);

const filtersSchema = computed(() => ({
  gridSize: 8,
  fieldSize: 8,
  fields: mapFiltersToFormSchema(props.filtersSchema),
}));

const appliedFiltersCount = computed(
  () =>
    Object.entries(props.filters).filter(
      ([key, value]) =>
        value != null &&
        value != "" &&
        ((Array.isArray(value) && (value as any)?.length > 0) ||
          !Array.isArray(value)) &&
        props.filtersSchema.some((filter) => filter.key === key)
    ).length
);

const formRef = ref<FormRefInstance>();
const filtersState = computed<GenericObject>(() =>
  !formRef.value ? {} : formRef.value?.formData
);

function applyFilters() {
  emit("update:filters", { ...filtersState.value });
}

function resetFilters() {
  formRef.value?.$clear();
  applyFilters();
}

onKeyPressed("Enter", () => applyFilters());
</script>

<template>
  <NTooltip>
    <template #trigger>
      <div class="w-auto" @click="isPanelOpen = true">
        <slot :active="appliedFiltersCount" />
      </div>
    </template>
    <div class="flex flex-col justify-center items-center">
      <span>Open filters</span>
      <span>({{ appliedFiltersCount }}) active</span>
    </div>
  </NTooltip>

  <KeepAlive>
    <NDrawer
      v-model:show="isPanelOpen"
      display-directive="show"
      :width="width < 502 ? width : 502"
    >
      <NDrawerContent
        :native-scrollbar="false"
        :footer-style="{ justifyContent: 'flex-start' }"
        closable
      >
        <template #header>
          <div class="flex items-center justify-start py-2">
            <NIcon class="mr-2">
              <i:mdi-filter-variant />
            </NIcon>
            <span>
              Filters
              {{ appliedFiltersCount > 0 ? `(${appliedFiltersCount})` : null }}
            </span>
          </div>
        </template>

        <div style="z-index: 3000 !important">
          <Form
            ref="formRef"
            :form-options="filtersSchema"
            :form-data="filters"
          >
            <template #actions></template>
          </Form>
        </div>

        <template #footer>
          <div class="grid grid-cols-2 items-center gap-4 w-full">
            <NButton type="error" class="w-full" @click="resetFilters">
              <template #icon>
                <n-icon>
                  <i:system-uicons:reset />
                </n-icon>
              </template>
              RESET
            </NButton>

            <NButton type="primary" class="w-full" @click="applyFilters">
              <template #icon>
                <n-icon>
                  <i:la:search />
                </n-icon>
              </template>
              SEARCH
            </NButton>
          </div>
        </template>
      </NDrawerContent>
    </NDrawer>
  </KeepAlive>
</template>
