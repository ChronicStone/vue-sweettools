<script setup lang="ts">
import {
  FieldComponentEmits,
  FieldComponentProps,
  ArrayListField,
  _BaseField,
} from "@/types/form/fields";
import { NCard, NTooltip, NButton, NCollapseTransition } from "naive-ui";
import FieldRenderer from "@/components/Form/Renderer/FieldRenderer.vue";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(() => props.field as _BaseField & ArrayListField);
const fieldValue = computed({
  get: () => props.modelValue as Record<string, any>[],
  set: (value) => emit("update:modelValue", value),
});

const formStyle = useFormStyles();
const gridSize = useBreakpointStyle(_field.value.gridSize ?? "", "grid-cols");

const listGridSize = useBreakpointStyle(
  _field.value.listGridSize ?? "1",
  "grid-cols"
);
const listItemSize = useBreakpointStyle(
  _field.value.listItemSize ?? "1",
  "col"
);

const { addItem, removeItem, moveItem } = useArrayField(_field, fieldValue);
</script>

<template>
  <NCollapseTransition :show="!collapsed">
    <div class="grid gap-4" :style="listGridSize">
      <TransitionGroup name="list">
        <NCard
          v-for="(item, index) in fieldValue"
          :key="`${_field.key}.${index}`"
          :style="listItemSize"
        >
          <template #header>
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
          </template>
          <template #header-extra>
            <NTooltip>
              <template #trigger>
                <mdi:trash
                  class="text-black dark:text-white hover:text-red-400 cursor-pointer"
                  @click.prevent="removeItem(index)"
                />
              </template>
              Delete item
            </NTooltip>
          </template>

          <FieldRenderer
            :key="index"
            v-model="fieldValue[index]"
            :field="{
              ..._field,
              type: 'object',
              collapsed: false,
              key: index.toString(),
              fieldParams: { frameless: true },
            }"
            :parent-key="[...parentKey, _field.key]"
            :item-index="index"
            :show-error="false"
          />
        </NCard>
      </TransitionGroup>

      <NButton
        style="grid-column: 1 / -1"
        dashed
        type="primary"
        class="w-full"
        icon-placement="right"
        @click="addItem"
      >
        <template #icon>
          <mdi:plus />
        </template>
        ADD ITEM
      </NButton>
    </div>
  </NCollapseTransition>
</template>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
