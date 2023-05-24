<script setup lang="ts">
import { vTestid } from "@chronicstone/vue-testid";
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NTimePicker } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const formTestId = useFormTestId();
const fieldKey = computed(() =>
  [...props.parentKey, props.field.key].join(".")
);
const testIdConfig = [
  {
    selector: 'input[type="text"]',
    value: `${formTestId.value}#field::${fieldKey.value}::input`,
  },
];
</script>

<template>
  <NTimePicker
    v-model:value="fieldValue"
    v-testid="testIdConfig"
    :style="group ? { width: `${size} !important` } : {}"
    :placeholder="context.placeholder.value"
    v-bind="context.inputProps.value"
    :disabled="disabled"
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
