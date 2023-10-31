<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NTreeSelect, TreeSelectOption } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () =>
    props.modelValue as
      | string
      | number
      | (string | number)[]
      | null
      | undefined,
  set: (value) => emit("update:modelValue", value),
});
</script>
<template>
  <NTreeSelect
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    v-bind="context.inputProps.value"
    :placeholder="context.placeholder.value"
    :options="(context.options.value as TreeSelectOption[])"
    :loading="context._evalOptions.value"
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    filterable
    @blur="validator?.$touch"
  />
</template>
