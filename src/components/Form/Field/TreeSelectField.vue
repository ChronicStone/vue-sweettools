<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NTreeSelect, TreeSelectOption } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
<template>
  <NTreeSelect
    v-model:value="fieldValue"
    v-bind="context.inputProps.value"
    :placeholder="field.placeholder"
    :options="(context.options.value as TreeSelectOption[])"
    :loading="context._evalOptions.value"
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    filterable
    @blur="validator.$touch"
  />
</template>
