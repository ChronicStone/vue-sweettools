<template>
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
                  rowData: data,
                  tableApi: tableApi,
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
</template>

<script setup lang="ts">
import { CellRendererParams, TableRowAction, TableApi } from "@/types/table";
import { NTooltip, NEl, NConfigProvider, NIcon } from "naive-ui";
import { GenericObject } from "@/types/utils";
import { computed } from "vue";

const props = defineProps<{
  actions: TableRowAction<GenericObject>[];
  data: GenericObject;
  tableApi: TableApi;
  permissionValidator: ReturnType<
    typeof useGlobalConfig
  >["permissionValidator"]["value"];
}>();

const rowActions = computed(() =>
  props.actions
    .map((action) => ({
      ...action,
      icon:
        typeof action.icon === "function"
          ? action.icon({ rowData: props.data })
          : action.icon,
      tooltip:
        typeof action.tooltip === "function"
          ? action.tooltip({ rowData: props.data })
          : action.tooltip,
      ...(action.link && {
        link:
          typeof action.link === "function"
            ? action.link({ rowData: props.data })
            : action.link,
      }),
    }))
    .filter(
      (action) =>
        action?.condition?.({
          rowData: props.data,
          tableApi: props.tableApi,
        }) ?? true
    )
    .filter((action) =>
      !action?.permissions?.length
        ? true
        : props.permissionValidator(action.permissions)
    )
);
</script>
