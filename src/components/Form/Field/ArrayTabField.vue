<script setup lang="ts">
import {
  ArrayField,
  FieldComponentEmits,
  FieldComponentProps,
} from "@/types/form/fields";
import {
  NCard,
  NCollapseTransition,
  TabsInst,
  NButton,
  NTabs,
  NTabPane,
  NDropdown,
  DropdownOption,
} from "naive-ui";
import FieldRenderer from "@/components/Form/Renderer/FieldRenderer.vue";
import { renderIcon } from "@/utils/renderIcon";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(() => props.field as ArrayField);

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const formStyle = useFormStyles();
const gridSize = useBreakpointStyle(props.field.gridSize ?? "", "grid-cols");

const activeTab = ref<number>(0);
const tabsInstanceRef = ref<TabsInst>();
const { addItem, removeItem, moveItem } = useArrayField(
  _field,
  fieldValue,
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
      onClick: () => removeItem(index),
    },
    {
      key: "moveLeft",
      label: "Move item left",
      icon: renderIcon("mdi:arrow-left"),
      disabled: index - 1 < 0,
      onClick: () => moveItem(index, "left"),
    },
    {
      key: "moveRight",
      label: "Move item right",
      icon: renderIcon("mdi:arrow-right"),
      disabled: index + 1 >= itemsLength,
      onClick: () => moveItem(index, "right"),
    },
  ];
}
</script>

<template>
  <NCollapseTransition :show="!collapsed">
    <NCard content-style="padding: 0;">
      <div v-if="!fieldValue?.length" class="w-full p-4">
        <NButton dashed type="primary" class="w-full" @click="addItem">
          <template #icon><i-mdi-plus /></template>
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
          <NButton secondary type="primary" class="mr-2" @click="addItem">
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
                :class="{ 'text-red-500': validator?.[index]?.$errors?.length }"
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
                  trigger="hover"
                  :options="buildItemControls(index, fieldValue?.length ?? 0)"
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
        <transition name="slide-fade" mode="out-in">
          <component
            :is="'div'"
            v-if="fieldValue?.[activeTab]"
            :key="activeTab"
            class="grid gap-4"
            :style="field.gridSize ? gridSize : formStyle?.gridSize"
          >
            <FieldRenderer
              v-model="fieldValue[activeTab]"
              :field="{ ..._field, type: 'object', key: activeTab }"
            />
          </component>
          <NEmpty v-else />
        </transition>
      </div>
    </NCard>
  </NCollapseTransition>
</template>
