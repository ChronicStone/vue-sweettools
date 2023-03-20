<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NDatePicker } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NDatePicker
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="field.placeholder"
    :type="field.type"
    v-bind="context.inputProps.value"
    update-value-on-close
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
