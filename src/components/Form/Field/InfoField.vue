<script setup lang="ts">
import {
  FieldComponentEmits,
  FieldComponentProps,
  InfoField,
} from "@/types/form/fields";
import { GenericObject } from "@/types/utils";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(() => props.field as InfoField);
const { virtualStore } = useFormState();

function renderInfoContent(
  content: InfoField["content"],
  dependencies: GenericObject,
  virtualDependencies: GenericObject
) {
  return renderVNode(content ?? "", dependencies, virtualDependencies);
}
</script>

<template>
  <component
    :is="
      renderInfoContent(
        _field.content,
        context.dependencies.value,
        virtualStore
      )
    "
  />
</template>
