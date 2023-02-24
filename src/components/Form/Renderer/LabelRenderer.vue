<script setup lang="ts">
import CollapseButton from "@/components/Utils/CollapseButton.vue";
import DescriptionPopup from "@/components/Utils/DescriptionPopup.vue";
import { ArrayField, FormField } from "@/types/form/fields";
import { GenericObject } from "@/types/utils";

const props = defineProps<{
  field: FormField;
  dependencies: GenericObject;
  required: boolean;
}>();

const collapsed = ref<boolean>((props.field as ArrayField)?.collapsed ?? false);
const collapsible = computed<boolean>(
  () => (props.field as ArrayField)?.collapsible ?? true
);
</script>

<template>
  <div
    v-if="
      (!field?.label && field.type === 'info') ||
      field.type === 'checkbox' ||
      (field.type === 'object' && field?.fieldParams?.frameless)
        ? false
        : true
    "
    class="flex gap-2 items-center justify-left"
  >
    <span
      v-if="field?.label"
      class="m-0 flex gap-2 justify-start items-center group cursor-pointer"
      style="cursor: pointer !important"
      @click="
        ['object', 'array', 'custom-component'].includes(field.type)
          ? (collapsed = !collapsed)
          : null
      "
    >
      <CollapseButton
        v-if="
          ['object', 'array', 'custom-component'].includes(field.type) &&
          (collapsible ?? ['object', 'array'].includes(field.type)
            ? true
            : false)
        "
        v-model="collapsed"
      />
      <label
        class="flex items-center transition-all ease-in-out duration-150"
        :class="{
          'cursor-pointer': ['object', 'array'].includes(field.type),
        }"
        :for="field.key"
      >
        <Component :is="renderVNode(props.field?.label ?? '', dependencies)" />
        <span class="text-red-500 ml-1.5">
          {{ required ? "*" : "" }}
        </span>
      </label>
    </span>

    <DescriptionPopup
      v-if="field.description"
      :description="field.description"
      :field-label="field.label"
    />
  </div>
</template>
