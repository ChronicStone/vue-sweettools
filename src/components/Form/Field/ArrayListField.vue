<script setup lang="ts">
import {
  FieldComponentEmits,
  FieldComponentProps,
  ArrayField,
} from "@/types/form/fields";
import { NCard, NCollapseTransition } from "naive-ui";
import FieldRenderer from "@/components/Form/Renderer/FieldRenderer.vue";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const _field = computed(() => props.field as ArrayField);

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const formStyle = useFormStyles();
const gridSize = useBreakpointStyle(props.field.gridSize ?? "", "grid-cols");
</script>

<template>Hi</template>
