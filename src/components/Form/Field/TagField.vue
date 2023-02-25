<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NDynamicTags } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NDynamicTags
    v-model:value="fieldValue"
    v-bind="context.inputProps.value"
    :disabled="disabled"
    @blur="validator.$touch"
  />
</template>
