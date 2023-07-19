<script setup lang="ts">
import CollapseButton from "@/components/Utils/CollapseButton.vue";
import DescriptionPopup from "@/components/Utils/DescriptionPopup.vue";
import { ObjectField, FormField } from "@/types/form/fields";
import { GenericObject } from "@/types/utils";
import { renderVNode } from "@/utils/renderVNode";

const emit = defineEmits<{ (e: "update:collapsed", value: boolean): void }>();
const props = defineProps<{
  field: FormField;
  dependencies: GenericObject;
  required: boolean;
  collapsed?: boolean;
  renderDescription?: boolean;
}>();

const collapsed = computed({
  get: () => props.collapsed,
  set: (value: boolean) => emit("update:collapsed", value),
});

const collapsible = computed<boolean>(
  () => (props.field as ObjectField)?.collapsible ?? true
);
</script>

<template>
  <div class="flex gap-2 items-center justify-left">
    <span
      v-if="field?.label"
      class="m-0 flex gap-2 justify-start items-center group cursor-pointer"
      style="cursor: pointer !important"
      @click="
        [
          'object',
          'array-list',
          'array-tabs',
          'custom-component',
          'array-variant',
        ].includes(field.type)
          ? (collapsed = !collapsed)
          : null
      "
    >
      <CollapseButton
        v-if="
          [
            'object',
            'array-list',
            'array-tabs',
            'custom-component',
            'array-variant',
          ].includes(field.type) &&
          (collapsible ??
          ['object', 'array-list', 'array-tabs', 'array-variant'].includes(
            field.type
          )
            ? true
            : false)
        "
        v-model="collapsed"
      />
      <label
        class="flex items-center transition-all ease-in-out duration-150"
        :class="{
          'cursor-pointer': [
            'object',
            'array-list',
            'array-tabs',
            'array-variant',
            'custom-component',
          ].includes(field.type),
        }"
        :for="field.key"
      >
        <Component
          :is="() => renderVNode(props.field?.label ?? '', dependencies, {})"
        />
        <span v-if="field.type !== 'checkbox'" class="text-red-500 ml-1.5">
          {{ required ? "*" : "" }}
        </span>
      </label>
    </span>

    <DescriptionPopup
      v-if="field.description && (renderDescription ?? true)"
      :description="field.description"
      :field-label="field.label ?? ''"
    />
  </div>
</template>
