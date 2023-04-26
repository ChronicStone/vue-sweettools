<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NCascader } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NCascader
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="context.placeholder.value"
    :options="context.options.value"
    v-bind="context.inputProps.value"
    :loading="context._evalOptions.value"
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    filterable
    @blur="validator?.$touch"
  />
</template>
