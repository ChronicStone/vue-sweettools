<script setup lang="ts">
import {
  DateField,
  FieldComponentEmits,
  FieldComponentProps,
} from "@/types/form/fields";
import { NDatePicker } from "naive-ui";
import { Value } from "naive-ui/es/date-picker/src/interface";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();
const field = computed(() => props.field as DateField);

const fieldValue = computed({
  get: () => props.modelValue as Value | null | undefined,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NDatePicker
    v-model:value="fieldValue"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="context.placeholder.value"
    :type="field.type"
    v-bind="context.inputProps.value"
    update-value-on-close
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
