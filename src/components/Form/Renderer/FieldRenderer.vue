<script setup lang="ts">
import { FormField } from "@/types/form/fields";
import useVuelidate from "@vuelidate/core";
import LabelRenderer from "./LabelRenderer.vue";
import { NInput } from "naive-ui";
import { getPropertyFromPath } from "@/utils/form/getPropertyFromPath";

const emit = defineEmits<{ (e: "update:modelValue", value: unknown): void }>();
const props = withDefaults(
  defineProps<{
    field: FormField & { _stepIndex?: number };
    modelValue: unknown;
    parentKey?: string[];
    parentId?: string;
    parentDisabled?: boolean;
    multiStep?: boolean;
    stepIndex?: number;
  }>(),
  {
    parentKey: () => [],
    parentId: undefined,
    parentDisabled: false,
    multiStep: false,
    stepIndex: undefined,
  }
);

const _field = computed(() => props.field);
const _parentKey = computed(() => props.parentKey);
const _multiStep = computed(() => props.multiStep);
const _stepIndex = computed(() => props.stepIndex);

const formStyle = useFormStyles();
const fieldSize = useBreakpointStyle(props.field?.size ?? "", "col");
const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const { formState } = useFormState();
const fieldContext = useFieldContext(_field, fieldValue, formState, _parentKey);
const parentContextState = computed(() =>
  getPropertyFromPath(_parentKey.value, formState.value)
);

const { scopeKey } = useValidationScope();
const fieldRules = useFieldRules(
  props.field,
  fieldContext,
  _parentKey,
  _multiStep,
  _stepIndex
);
const $validator = useVuelidate(fieldRules, parentContextState, {
  $scope: scopeKey,
});

const errorMessage = computed(() => {
  if (props.field.type != "array")
    return $validator.value.$errors.filter(
      (err) => err.$validator != "$each"
    )[0]?.$message;
  else {
    if ($validator.value.$errors[0]?.$validator === "$each")
      return `The field ${props.field.label} has items with invalid properties`;
    else return $validator.value.$errors[0]?.$message;
  }
});
</script>

<template>
  <template
    v-if="
      fieldContext.condition.value ||
      fieldContext.conditionEffect.value === 'disable'
    "
  >
    <div
      class="flex flex-col gap-2"
      :class="{
        'flex-col': (field?.labelPosition ?? 'top') === 'top',
        'flex-row items-center': (field?.labelPosition ?? 'top') === 'left',
      }"
      :style="formStyle?.fieldSize.value"
    >
      <LabelRenderer
        :field="field"
        :dependencies="fieldContext.dependencies.value"
        :required="fieldContext.required.value"
      />

      <NInput
        v-if="['text', 'textarea', 'password'].includes(field.type)"
        v-model:value="fieldValue"
        :class="{ fieldError: $validator?.$errors?.length }"
        :type="field.type"
        v-bind="fieldContext.inputProps.value"
        :placeholder="field.placeholder"
        :disabled="
          (fieldContext.condition.value == false &&
            fieldContext.conditionEffect.value == 'disable') ||
          parentDisabled
        "
        :status="$validator?.$errors?.length ? 'error' : 'success'"
        @blur="$validator.$touch"
      />

      <div
        v-if="$validator?.$errors?.length"
        class="flex items-center gap-2 transition-all ease-in-out duration-300 transform"
      >
        <span class="text-red-500">{{ errorMessage }}</span>
      </div>
    </div>
  </template>
</template>

<script lang="ts">
export default {
  name: "FieldRenderer",
};
</script>
