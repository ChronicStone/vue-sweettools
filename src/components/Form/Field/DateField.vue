<script setup lang="ts">
import {
  DateField,
  FieldComponentEmits,
  FieldComponentProps,
} from "@/types/form/fields";
import { NDatePicker } from "naive-ui";
import { FormattedValue } from "naive-ui/es/date-picker/src/interface";
import { format } from "date-fns";
const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();
const field = computed(() => props.field as DateField);

const fieldValue = computed({
  get: () => props.modelValue as FormattedValue | null | undefined,
  set: (value) => emit("update:modelValue", value),
});

const value = ref<FormattedValue | null | undefined>(
  parseInput(fieldValue.value)
);

const formats = {
  date: "yyyy-MM-dd",
  datetime: "yyyy-MM-dd HH:mm:ss",
  daterange: "yyyy-MM-dd",
  datetimerange: "yyyy-MM-dd HH:mm:ss",
  month: "yyyy-MM",
  year: "yyyy",
};

function parseInput(value: any) {
  try {
    const _format =
      (props.context.inputProps.value?.format as string) ??
      formats[field.value.type];
    if (!value) return null;
    const val = Array.isArray(value)
      ? [
          format(new Date(value[0]), _format),
          format(new Date(value[1]), _format),
        ]
      : format(new Date(value), _format);
    console.info(val);
    return val as FormattedValue;
  } catch (err) {
    return null;
  }
}

function parseOutput(value: FormattedValue | null | undefined) {
  if (value) {
    return value;
  } else {
    return null;
  }
}

watch(
  () => value.value,
  (v) => {
    console.info(v);
    fieldValue.value = parseOutput(v);
  }
);
</script>

<template>
  <NDatePicker
    v-model:formatted-value="value"
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
