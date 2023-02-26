<script setup lang="ts">
import { NCollapseTransition } from "naive-ui";
import {
  CustomField,
  FieldComponentEmits,
  FieldComponentProps,
} from "@/types/form/fields";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(() => props.field as CustomField);

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NCollapseTransition>
    <component
      :is="_field.component"
      v-show="!collapsed"
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
