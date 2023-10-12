<script setup lang="ts">
import {
  ArrayTabsField,
  ArrayVariantField,
  FieldComponentEmits,
  FieldComponentProps,
  _BaseField,
} from "@/types/form/fields";
import {
  NCard,
  TabsInst,
  NButton,
  NTabs,
  NTabPane,
  NDropdown,
  DropdownOption,
  NCollapseTransition,
} from "naive-ui";
import FieldRenderer from "@/components/Form/Renderer/FieldRenderer.vue";
import { renderIcon } from "@/utils/renderIcon";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(
  () => props.field as _BaseField & (ArrayTabsField | ArrayVariantField)
);

const fieldValue = computed({
  get: () => props.modelValue as Record<string, any>[],
  set: (value) => emit("update:modelValue", value),
});

const formStyle = useFormStyles();
const gridSize = useBreakpointStyle(props.field.gridSize ?? "", "grid-cols");

const activeTab = ref<number>(0);
const tabsInstanceRef = ref<TabsInst>();
const {
  addItem,
  removeItem,
  moveItem,
  resolveVariantFields,
  customActions,
  baseActions,
} = useArrayField(
  _field,
  fieldValue,
  props.context,
  activeTab,
  tabsInstanceRef
);

function buildItemControls(
  index: number,
  itemsLength: number
): DropdownOption[] {
  return [
    {
      key: "delete",
      label: "Delete item",
      icon: renderIcon("mdi:trash"),
      props: { onClick: () => removeItem(index) },
      disabled: !baseActions.value.items[index].deleteItem,
    },
    {
      key: "moveLeft",
      label: "Move item left",
      icon: renderIcon("mdi:arrow-left"),
      disabled: !baseActions.value.items[index].moveUp,
      props: { onClick: () => moveItem(index, "left") },
      show: index > 0,
    },
    {
      key: "moveRight",
      label: "Move item right",
      icon: renderIcon("mdi:arrow-right"),
      disabled: !baseActions.value.items[index].moveDown,
      props: { onClick: () => moveItem(index, "right") },
      show: index + 1 < itemsLength,
    },
  ];
}
</script>

<template>
  <NCollapseTransition :show="!collapsed">
    <NCard content-style="padding: 0;">
      <div v-if="!fieldValue?.length" class="w-full p-4">
        <NButton
          dashed
          type="primary"
          class="w-full"
          :disabled="!baseActions.addItem"
          @click="addItem"
        >
          <template #icon><mdi-plus /></template>
          Create item
        </NButton>
      </div>
      <NTabs
        v-if="fieldValue?.length"
        ref="arrayTabsRef"
        type="line"
        size="large"
        :tabs-padding="20"
        display-directive="show"
        closable
        addable
        :value="activeTab"
        :on-add="addItem"
        :on-close="removeItem"
        :on-update:value="(index: number) => (activeTab = index)"
      >
        <template #suffix>
          <NButton
            :disabled="!baseActions.addItem"
            secondary
            type="primary"
            class="mr-2"
            @click="addItem"
          >
            <template #icon><mdi-plus /></template>
          </NButton>
        </template>

        <NTabPane
          v-for="(item, index) in fieldValue"
          :key="index"
          :name="index"
        >
          <template #tab>
            <div class="flex gap-4 justify-between items-center">
              <div
                :class="{
                  'text-red-500': validator?.[index]?.$errors?.length,
                }"
              >
                <span
                  v-if="_field.headerTemplate"
                  v-html="_field.headerTemplate(fieldValue[index], index)"
                />
                <span v-else>ITEM {{ index + 1 }}</span>
              </div>
              <div
                class="flex items-center gap-0 text-xs text-black dark:text-white"
              >
                <NDropdown
                  v-if="
                    [
                      ...buildItemControls(index, fieldValue?.length ?? 0),
                      ...(customActions[index] ?? []),
                    ].length > 0
                  "
                  trigger="hover"
                  :options="[
                    ...buildItemControls(index, fieldValue?.length ?? 0),
                    ...(customActions[index] ?? []),
                  ]"
                >
                  <NButton quaternary size="small" circle>
                    <template #icon>
                      <mdi-chevron-down />
                    </template>
                  </NButton>
                </NDropdown>
              </div>
            </div>
          </template>
        </NTabPane>
      </NTabs>

      <div v-if="fieldValue?.length" class="overflow-x-hidden pb-5 px-5">
        <component
          :is="'div'"
          v-for="(_, index) in fieldValue"
          v-show="index === activeTab"
          :key="index"
          class="grid gap-4"
          :style="field.gridSize ? gridSize : formStyle?.gridSize"
        >
          <FieldRenderer
            v-model="fieldValue[index]"
            :field="{
              ..._field,
              fields:
                _field.type === 'array-variant'
                  ? resolveVariantFields(fieldValue[index])
                  : _field.fields,
              type: 'object',
              collapsed: false,
              key: index.toString(),
              fieldParams: { frameless: true },
              condition: () => true,
            }"
            :render-label="false"
            :parent-key="[...parentKey, _field.key]"
            :item-index="index"
            :show-error="false"
          />
        </component>

        <NEmpty v-show="!fieldValue[activeTab]" />
      </div>
    </NCard>
  </NCollapseTransition>
</template>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.35s, transform 0.4s;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30%);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30%);
}
</style>
