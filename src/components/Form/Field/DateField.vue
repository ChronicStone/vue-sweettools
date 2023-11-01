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

const { displayFormat, valueFormat } = useLocalizedDateFormat();

const fieldValue = computed({
  get: () => props.modelValue as FormattedValue | null | undefined,
  set: (value) => emit("update:modelValue", value),
});

const value = ref<FormattedValue | null | undefined>(
  parseInput(fieldValue.value)
);

function parseInput(value: any) {
  try {
    const _format =
      (props.context.inputProps.value?.format as string) ??
      displayFormat.value[field.value.type];
    if (!value) return null;
    const val = Array.isArray(value)
      ? [
          format(new Date(value[0]), _format),
          format(new Date(value[1]), _format),
        ]
      : format(new Date(value), _format);
    return val as FormattedValue;
  } catch (err) {
    console.info("failed parsing input", {
      format:
        props.context.rawInputProps.value?.format ??
        displayFormat.value[field.value.type],
      value,
      err,
    });
    return null;
  }
}

function parseOutput(value: FormattedValue | null | undefined) {
  try {
    const _format = (value: string) =>
      !value
        ? null
        : format(
            new Date(value),
            (props.context.rawInputProps.value?.valueFormat as string) ??
              (props.context.rawInputProps.value?.format as string) ??
              valueFormat.value[field.value.type]
          );
    if (Array.isArray(value))
      return [_format(value[0]), _format(value[1])] as FormattedValue;
    if (!value) return null;
    return _format(value);
  } catch (err) {
    console.info("failed parsing output", {
      format:
        props.context.rawInputProps.value?.format ??
        props.context.rawInputProps.value?.valueFormat ??
        valueFormat.value[field.value.type],
      value,
      err,
    });
    return value;
  }
}

watch(
  () => value.value,
  (v) => (fieldValue.value = parseOutput(v)),
  { immediate: true }
);

watch(
  () => fieldValue.value,
  (v) => v !== parseOutput(value.value) && (value.value = parseInput(v))
);
</script>

<template>
  <NDatePicker
    v-model:formatted-value="value"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="context.placeholder.value"
    :type="field.type"
    v-bind="{
      ...context.inputProps.value,
      format: (props.context.inputProps.value?.format as string) ??
      displayFormat[field.type]
    }"
    update-value-on-close
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
