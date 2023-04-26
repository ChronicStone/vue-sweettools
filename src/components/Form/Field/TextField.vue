<script setup lang="ts">
import { FieldComponentEmits, FieldComponentProps } from "@/types/form/fields";
import { MaskOptions, vMaska } from "maska";
import { NInput } from "naive-ui";

const emit = defineEmits<FieldComponentEmits>();
const props = defineProps<FieldComponentProps>();

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const maskConfig = computed(() => {
  const maskConf = props.context.inputProps.value?.mask;
  if (!maskConf) return {};
  else if (typeof maskConf === "string") return { mask: maskConf };
  return maskConf as MaskOptions;
});

const fieldProps = computed(() => {
  const { mask, ...params } = props.context.inputProps.value;
  return params;
});
</script>

<template>
  <NInput
    v-model:value="fieldValue"
    v-maska:[maskConfig]
    :style="group ? { width: `${size} !important` } : {}"
    :class="{ fieldError: validator?.$errors?.length }"
    :type="field.type"
    v-bind="fieldProps"
    :placeholder="context.placeholder.value"
    :disabled="
      (context.condition.value == false &&
        context.conditionEffect.value == 'disable') ||
      parentDisabled
    "
    :status="validator?.$errors?.length ? 'error' : 'success'"
    @blur="validator?.$touch"
  />
</template>
