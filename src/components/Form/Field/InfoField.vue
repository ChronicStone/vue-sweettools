<script setup lang="ts">
import {
  FieldApi,
  FieldComponentEmits,
  FieldComponentProps,
  InfoField,
} from "@/types/form/fields";
import { GenericObject } from "@/types/utils";
import { renderVNode } from "@/utils/renderVNode";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(() => props.field as InfoField);

function renderInfoContent(
  content: InfoField["content"],
  dependencies: GenericObject,
  fieldApi: FieldApi
) {
  return renderVNode(content ?? "", dependencies, fieldApi);
}
</script>

<template>
  <component
    :is="
      renderInfoContent(
        _field.content,
        context.dependencies.value,
        context.fieldApi
      )
    "
  />
</template>
