<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider :theme="theme" :theme-overrides="themeOverrides ?? null">
      <div :style="{ width: `${width}px` }" class="flex">
        <div class="flex gap-2 items-center">
          <template v-if="rowActions?.length">
            <NTooltip
              v-for="({ icon, tooltip, link, action }, key) in rowActions"
              :key="key"
            >
              <template #trigger>
                <component
                  :is="link ? 'router-link' : 'div'"
                  v-bind="{
                    ...(link ? { to: link } : {}),
                  }"
                  v-on="{
                    click: () =>
                      action?.({
                        rowData: params.data,
                        tableApi: params.tableApi.value,
                      }),
                  }"
                >
                  <NIcon size="18" class="mt-4">
                    <NEl
                      tag="span"
                      class="iconify cursor-pointer hover:text-[var(--primary-color)] transition-all ease-in-out duration-150"
                      :data-icon="icon"
                    />
                  </NIcon>
                </component>
              </template>
              {{ tooltip }}
            </NTooltip>
          </template>
          <template v-else>N/A</template>
        </div>
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { CellRendererParams, TableRowAction } from "@/types/table";
import { NTooltip, NEl, NConfigProvider, NIcon } from "naive-ui";
import { GenericObject } from "@/types/utils";
import { useElementSize } from "@vueuse/core";
import { Ref, computed, ref } from "vue";

interface ActionsCellProps extends CellRendererParams {
  _rowActions: TableRowAction<GenericObject>[];
  permissionValidator: ReturnType<
    typeof useGlobalConfig
  >["permissionValidator"]["value"];
}

const props = defineProps<{ params: ActionsCellProps }>();
const theme = computed(() => props.params.getTheme());
const themeOverrides = computed(() => props.params.getThemeOverrides());

const cellContainerRef = ref<HTMLElement>(props.params.eGridCell);
const { width } = useElementSize(cellContainerRef as Ref<HTMLDivElement>);

const rowActions = computed(() =>
  props.params._rowActions
    .map((action) => ({
      ...action,
      icon:
        typeof action.icon === "function"
          ? action.icon({ rowData: props.params.data })
          : action.icon,
      tooltip:
        typeof action.tooltip === "function"
          ? action.tooltip({ rowData: props.params.data })
          : action.tooltip,
      ...(action.link && {
        link:
          typeof action.link === "function"
            ? action.link({ rowData: props.params.data })
            : action.link,
      }),
    }))
    .filter(
      (action) =>
        action?.condition?.({
          rowData: props.params.data,
          tableApi: props.params.tableApi.value,
        }) ?? true
    )
    .filter((action) =>
      !action?.permissions?.length
        ? true
        : props.params.permissionValidator(action.permissions)
    )
);
</script>
