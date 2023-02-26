<script setup lang="ts">
import { FormSchema } from "@/types/form/form";
import FieldRenderer from "./FieldRenderer.vue";
import useVuelidate, { ValidationArgs, ValidationRule } from "@vuelidate/core";
import { FormRefInstance } from "@/types/form/instance";
import { required, helpers, minLength } from "@vuelidate/validators";
import { GenericObject } from "@/types/utils";
import { resolveFieldDependencies } from "@/utils/form/resolveFieldDependencies";
import { ObjectField } from "@/types/form/fields";
import { _BaseField } from "@/types/form/fields";
import { getPropertyFromPath } from "@/utils/form/getPropertyFromPath";

const emit = defineEmits<{ (e: "test"): void }>();
const props = defineProps<{
  schema: FormSchema;
  data?: any;
  modalMode?: boolean;
  _resolve?: (() => void) | null;
}>();

const _formSchema = computed<FormSchema>(() => props.schema);
const _modalMode = computed<boolean>(() => props.modalMode);

const libConfig = useGlobalConfig();
const formFields = useFormFields(_formSchema);
const { formState, outputFormState, reset } = useProvideFormState(
  formFields,
  props.data
);

const layoutConf = useProvideFormStyles(props.schema);
const LayoutContainer = useFormLayout(_modalMode, layoutConf);

const validationScope = useProvideValidationScope();
const { $validator } = useProvideFormValidation(formFields, formState);

function updateRootFieldValue(
  field: ReturnType<typeof useFormFields>["value"][number],
  value: unknown
) {
  if (field._stepRoot) formState.value[field._stepRoot][field.key] = value;
  else formState.value[field.key] = value;
}

defineExpose<FormRefInstance>({
  $data: outputFormState,
  $reset: reset,
  $validate: () => $validator.value.$validate(),
});
</script>

<template>
  <LayoutContainer>
    <template #fields>
      <FieldRenderer
        v-for="(field, index) in formFields"
        :key="index"
        :field="field"
        :model-value="
          field._stepRoot
            ? formState[field._stepRoot][field.key]
            : formState[field.key]
        "
        @update:model-value="updateRootFieldValue(field, $event)"
      />
    </template>
  </LayoutContainer>
</template>

<style>
:is(.n-input__textarea-el, .n-tooltip) {
  overscroll-behavior-y: contain;
}

:is(.n-input__textarea-el, .n-tooltip, .editor__content)::-webkit-scrollbar {
  width: 5px;
  cursor: pointer !important;
}

:is(
    .n-input__textarea-el,
    .n-tooltip,
    .editor__content
  )::-webkit-scrollbar-thumb {
  @apply bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer hover:bg-gray-300;
  cursor: pointer !important;
}

:is(
    .n-input__textarea-el,
    .n-tooltip,
    .editor__content
  )::-webkit-scrollbar-track {
  background: transparent;
  padding: 5px;
}
</style>
