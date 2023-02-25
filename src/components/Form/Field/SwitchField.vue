<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>switch</template>
