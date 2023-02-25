<script setup lang="ts">
import { ArrayField, FormField } from "@/types/form/fields";
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
    itemIndex?: number | null;
    parentDisabled?: boolean;
    multiStep?: boolean;
    stepIndex?: number;
    showError?: boolean;
  }>(),
  {
    parentKey: () => [],
    itemIndex: null,
    parentDisabled: false,
    multiStep: false,
    stepIndex: undefined,
    showError: true,
  }
);

const _field = computed(() => props.field);
const _parentKey = computed(() => props.parentKey);
const _multiStep = computed(() => props.multiStep);
const _stepIndex = computed(() => props.stepIndex);

const formStyle = useFormStyles();
const collapsed = ref<boolean>((props.field as ArrayField)?.collapsed ?? false);
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
  fieldValue,
  _parentKey,
  _multiStep,
  _stepIndex
);
const $validator = useVuelidate(fieldRules, parentContextState, {
  $scope: scopeKey,
  ...(props.itemIndex !== null && {
    $registerAs: `${props.parentKey.join(".")}.${props.itemIndex}`,
  }),
});

const errorMessage = computed(() => {
  if (!["array", "object"].includes(props.field.type))
    return $validator.value.$errors.filter(
      (err) => err.$validator != "$each"
    )[0]?.$message;
  else {
    if ($validator.value.$errors[0]?.$property !== _field.value.key)
      return _field.value.type === "array"
        ? `The field ${props.field.label
            ?.toString()
            ?.toLocaleLowerCase()} has items with invalid properties`
        : `The field ${props.field.label
            ?.toString()
            ?.toLocaleLowerCase()} has invalid properties`;
    else return $validator.value.$errors[0]?.$message;
  }
});

const FieldComponent = useFieldComponent(_field);
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
      :style="field.size ? fieldSize : formStyle?.fieldSize.value"
    >
      <LabelRenderer
        v-if="
          (!field?.label && field.type === 'info') ||
          field.type === 'checkbox' ||
          (field.type === 'object' && field?.fieldParams?.frameless)
            ? false
            : true
        "
        v-model:collapsed="collapsed"
        :field="field"
        :dependencies="fieldContext.dependencies.value"
        :required="fieldContext.required.value"
      />

      <FieldComponent
        v-model="fieldValue"
        :field="field"
        :context="fieldContext"
        :validator="$validator"
        :disabled="
          (fieldContext.condition.value == false &&
            fieldContext.conditionEffect.value == 'disable') ||
          parentDisabled
        "
        :parent-disabled="parentDisabled"
        :collapsed="collapsed"
        :parent-key="parentKey"
      />

      <div
        v-if="$validator?.$errors?.length && showError"
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
