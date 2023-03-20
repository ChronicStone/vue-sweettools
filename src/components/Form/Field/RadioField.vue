<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NRadio, NRadioGroup } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue as string | number | boolean | null | undefined,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <NRadioGroup
    v-if="field.type === 'radio'"
    v-model:value="fieldValue"
    :name="field.key"
    :disabled="disabled"
    @blur="validator?.$touch"
  >
    <div class="gap-4 flex flex-wrap justify-start">
      <NRadio
        v-for="({ label, value }, optionId) in context.options.value"
        :key="optionId"
        :style="
          optionId ===
          (context.options.value?.length ?? field?.options?.length) - 1
            ? 'margin-right: auto;'
            : ''
        "
        :value="value"
        v-bind="context.inputProps.value"
        @blur="validator?.$touch"
      >
        {{ label }}
      </NRadio>
    </div>
  </NRadioGroup>
</template>
