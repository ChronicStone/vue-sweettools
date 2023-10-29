<script setup lang="ts">
import {
  FieldComponentEmits,
  FieldComponentProps,
  ArrayListField,
  _BaseField,
  ArrayVariantField,
} from "@/types/form/fields";
import {
  NCard,
  NTooltip,
  NButton,
  NCollapseTransition,
  NDropdown,
} from "naive-ui";
import FieldRenderer from "@/components/Form/Renderer/FieldRenderer.vue";
import { useTranslations } from "@/i18n/composables/useTranslations";
import { createReusableTemplate } from "@vueuse/core";

const i18n = useTranslations();
const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(
  () =>
    props.field as _BaseField &
      (ArrayListField | (ArrayVariantField & { displayMode: "list" }))
);
const fieldValue = computed({
  get: () => props.modelValue as Record<string, any>[],
  set: (value) => emit("update:modelValue", value),
});

const gridSize = useBreakpointStyle(_field.value.gridSize ?? "", "grid-cols");
const listGridSize = useBreakpointStyle(
  _field.value.listGridSize ?? "1",
  "grid-cols"
);
const listItemSize = useBreakpointStyle(
  _field.value.listItemSize ?? "1",
  "col"
);

const {
  addItem,
  removeItem,
  moveItem,
  customActions,
  baseActions,
  resolveVariantFields,
} = useArrayField(_field, fieldValue, props.context);

const [DefineActionsTemplate, ReuseActionsTemplate] = createReusableTemplate<{
  index: number;
}>();

const [DefineHeaderTemplate, ReuseHeaderTemplate] = createReusableTemplate<{
  index: number;
}>(); // <--- This is the only difference between the two snippets
</script>

<template>
  <DefineActionsTemplate v-slot="{ index }">
    <div class="flex items-center gap-1.5">
      <NTooltip>
        <template #trigger>
          <NButton
            text
            :disabled="!baseActions.items[index].deleteItem"
            @click.prevent="removeItem(index)"
          >
            <mdi:trash />
          </NButton>
        </template>
        {{ i18n.t("form.fields.array.deleteItem") }}
      </NTooltip>
      <NDropdown
        v-if="customActions[index].length"
        :options="customActions[index]"
        trigger="hover"
      >
        <NButton text>
          <mdi:dots-horizontal />
        </NButton>
      </NDropdown>
    </div>
  </DefineActionsTemplate>

  <DefineHeaderTemplate v-slot="{ index }">
    <div
      :class="{
        'text-red-500': validator?.[index]?.$errors?.length,
      }"
    >
      <span
        v-if="_field.headerTemplate"
        v-html="_field.headerTemplate(fieldValue[index], index)"
      />
      <span v-else class="uppercase">
        {{
          i18n.t("form.fields.array.headerTemplate", {
            index: index + 1,
            total: fieldValue.length,
          })
        }}
      </span>
    </div>
  </DefineHeaderTemplate>

  <NCollapseTransition :show="!collapsed">
    <component
      :is="_field.compact ? NCard : 'div'"
      class="grid gap-4"
      :style="[listGridSize]"
      :content-style="`display: grid; grid-gap: 1em; ${listGridSize}`"
    >
      <TransitionGroup name="list">
        <component
          :is="_field.compact ? 'div' : NCard"
          v-for="(item, index) in fieldValue"
          :key="`${_field.key}.${index}`"
          :style="listItemSize"
          :class="{ 'flex items-center gap-2 justify-between': _field.compact }"
        >
          <template #header>
            <ReuseHeaderTemplate :index="index" />
          </template>
          <template #header-extra>
            <ReuseActionsTemplate :index="index" />
          </template>

          <FieldRenderer
            :key="index"
            v-model="fieldValue[index]"
            class="!w-full"
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
            :parent-key="[...parentKey, _field.key]"
            :item-index="index"
            :show-error="false"
          />

          <ReuseActionsTemplate v-if="_field.compact" :index="index" />
        </component>
      </TransitionGroup>

      <NButton
        :disabled="!baseActions.addItem"
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
        {{ i18n.t("form.fields.array.createItem") }}
      </NButton>
    </component>
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
