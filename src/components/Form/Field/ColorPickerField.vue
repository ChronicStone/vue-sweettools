<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NColorPicker } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue as string | undefined | null,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NColorPicker v-model:value="fieldValue" v-bind="context.inputProps.value" />
</template>
