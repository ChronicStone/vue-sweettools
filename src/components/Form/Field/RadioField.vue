<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { NRadio, NRadioGroup } from "naive-ui";
import { VNodeChild } from "vue";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue as string | number | boolean | null | undefined,
  set: (value) => emit("update:modelValue", value),
});

const options = computed(() => {
  return (props.context.options ?? []) as unknown as Array<{
    label: string | (() => VNodeChild);
    value: string | number | boolean | undefined;
  }>;
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
        v-for="(option, optionId) in options"
        :key="optionId"
        :style="
          optionId ===
          (context.options.value?.length ?? field?.options?.length) - 1
            ? 'margin-right: auto;'
            : ''
        "
        :value="option.value"
        v-bind="context.inputProps.value"
        @blur="validator?.$touch"
      >
        {{ renderVNode(option.label) }}
      </NRadio>
    </div>
  </NRadioGroup>
</template>
