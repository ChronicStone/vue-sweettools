<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NCheckboxGroup, NCheckbox } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const formStyle = useFormStyles();
const gridSize = useBreakpointStyle(props.field.gridSize ?? "", "grid-cols");
</script>

<template>
  <NCheckboxGroup
    v-if="field.type === 'checkbox-group'"
    v-model:value="fieldValue"
    v-bind="context.inputProps.value"
    :disabled="disabled"
  >
    <div
      class="grid gap-4"
      :style="field.gridSize ? gridSize : formStyle?.gridSize.value"
    >
      <NCheckbox
        v-for="(option, index) in context.options.value ?? field.options"
        :key="index"
        class="col-span-1"
        :value="(option.value as string)"
        :label="(option.label as string)"
        :disabled="disabled"
        @blur="validator.$touch"
      />
    </div>
  </NCheckboxGroup>
</template>
