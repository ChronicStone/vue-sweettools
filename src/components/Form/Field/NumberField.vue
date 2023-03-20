<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NInputNumber } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NInputNumber
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    v-bind="context.inputProps.value"
    :placeholder="field.placeholder"
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
