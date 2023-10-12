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
  <NCollapseTransition :show="!collapsed">
    <component
      :is="_field.component"
      v-model="fieldValue"
      v-bind="{
        ...context.rawInputProps.value,
        dependencies: context.dependencies.value,
        options: context.options,
        evalOptions: context._evalOptions.value,
        evalCondition: context._evalCondition.value,
        validator: validator,
        placeholder: context.placeholder.value,
        disabled: context.disabled.value,
      }"
    />
  </NCollapseTransition>
</template>
