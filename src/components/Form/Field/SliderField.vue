<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NSlider } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue as number | number[] | undefined,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div
    v-if="['slider'].includes(field.type)"
    class="flex flex-col gap-1 justify-center items-center h-full"
  >
    <NSlider
      v-model:value="fieldValue"
      v-bind="context.inputProps.value"
      :disabled="disabled"
      @blur="validator?.$touch"
    />
  </div>
</template>
