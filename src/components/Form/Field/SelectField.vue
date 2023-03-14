<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NSelect } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NSelect
    v-model:value="fieldValue"
    :placeholder="field.placeholder"
    :options="context.options.value"
    v-bind="context.inputProps.value"
    :loading="context._evalOptions.value"
    filterable
    :disabled="
      (context.condition.value == false &&
        context.conditionEffect.value == 'disable') ||
      parentDisabled
    "
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
