<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NInput } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NInput
    v-model:value="fieldValue"
    :class="{ fieldError: validator?.$errors?.length }"
    :type="field.type"
    v-bind="context.inputProps.value"
    :placeholder="field.placeholder"
    :disabled="
      (context.condition.value == false &&
        context.conditionEffect.value == 'disable') ||
      parentDisabled
    "
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
