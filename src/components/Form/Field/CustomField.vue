<script setup lang="ts">
import {
  CustomField,
  FieldComponentEmits,
  FieldComponentProps,
} from "@/types/form/fields";
import { NCollapseTransition } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(() => props.field as CustomField);

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NCollapseTransition :show="!collapsed">
    <component
      :is="_field.component"
      v-model="fieldValue"
      v-bind="{
        ..._field.fieldParams,
        dependencies: context.dependencies.value,
        options: context.options,
        evalOptions: context._evalOptions.value,
        evalCondition: context._evalCondition.value,
      }"
    />
  </NCollapseTransition>
</template>
