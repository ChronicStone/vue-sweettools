<script setup lang="ts">
import { onKeyPressed, useWindowSize } from "@vueuse/core";
import { NTooltip, NButton, NDrawer, NDrawerContent, NIcon } from "naive-ui";
import { computed, ref } from "vue";
import { TableFilter } from "@/types/table";
import { GenericObject, Narrowable } from "@/types/utils";
import { mapFiltersToFormSchema } from "@/utils/table/mapFiltersToFormSchema.js";
import { FormRefInstance } from "@/types/form/instance";
import FormRenderer from "../Form/Renderer/FormRenderer.vue";
import { FormSchema } from "@/types/form/form";
import { FormField } from "@/types/form/fields";
import { useTranslations } from "@/i18n/composables/useTranslations";

const emit = defineEmits<{
  (e: "update:filters", value: GenericObject): void;
}>();

const props = defineProps<{
  filtersSchema: TableFilter[];
  filters: GenericObject;
}>();

const i18n = useTranslations();
const { width } = useWindowSize();
const isPanelOpen = ref<boolean>(false);

const filtersSchema = computed(
  () =>
    buildFormSchema({
      gridSize: 8,
      fieldSize: 8,
      fields: mapFiltersToFormSchema(props.filtersSchema) as Array<
        FormField<Narrowable>
      >,
    }) as FormSchema<any, any>
);

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
const { formData: filtersState } = useFormController(
  formRef,
  filtersSchema.value as any
);

function applyFilters() {
  emit("update:filters", { ...filtersState.value });
}

function resetFilters() {
  formRef.value?.$reset(true);
  applyFilters();
}

onKeyPressed("Enter", () => applyFilters());

defineExpose({
  appliedFiltersCount,
});
</script>

<template>
  <NTooltip>
    <template #trigger>
      <div class="w-auto" @click="isPanelOpen = true">
        <slot :active="appliedFiltersCount" />
      </div>
    </template>
    <div class="flex flex-col justify-center items-center">
      <span>{{ i18n.t("datatable.filtersTooltipLabel") }}</span>
      <span>{{
        i18n.t("datatable.appliedFiltersCount", {
          count: appliedFiltersCount,
        })
      }}</span>
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
              <mdi:filter-variant />
            </NIcon>
            <span>
              {{ i18n.t("datatable.filtersPanelTitle") }}
              {{ appliedFiltersCount > 0 ? `(${appliedFiltersCount})` : null }}
            </span>
          </div>
        </template>

        <div style="z-index: 3000 !important">
          <FormRenderer ref="formRef" :schema="filtersSchema" :data="filters" />
        </div>

        <template #footer>
          <div class="grid grid-cols-2 items-center gap-4 w-full">
            <NButton type="error" class="w-full" @click="resetFilters">
              <template #icon>
                <n-icon>
                  <system-uicons:reset />
                </n-icon>
              </template>
              {{ i18n.t("datatable.filtersPanelResetButton") }}
            </NButton>

            <NButton type="primary" class="w-full" @click="applyFilters">
              <template #icon>
                <n-icon>
                  <la:search />
                </n-icon>
              </template>
              {{ i18n.t("datatable.filtersPanelSubmitButton") }}
            </NButton>
          </div>
        </template>
      </NDrawerContent>
    </NDrawer>
  </KeepAlive>
</template>
