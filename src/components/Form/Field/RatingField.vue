<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NRate } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue as number | undefined,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NRate v-model:value="fieldValue" v-bind="context.inputProps.value" />
</template>
