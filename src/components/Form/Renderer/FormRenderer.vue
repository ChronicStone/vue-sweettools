<script setup lang="ts">
import { FormSchema } from "@/types/form/form";
import FieldRenderer from "./FieldRenderer.vue";
import useVuelidate from "@vuelidate/core";
import { FormRefInstance } from "@/types/form/instance";

const emit = defineEmits<{ (e: "test"): void }>();
const props = defineProps<{
  schema: FormSchema;
  data?: any;
  modalMode?: boolean;
  _resolve?: (() => void) | null;
}>();

const _formSchema = computed<FormSchema>(() => props.schema);
const _modalMode = computed<boolean>(() => props.modalMode);

const { formState, outputFormState, reset } = useProvideFormState();

const formStyleApi = useProvideFormStyles(props.schema);
const LayoutContainer = useFormLayout(_formSchema);
const formFields = useFormFields(_formSchema);

const validationScope = useProvideValidationScope();
const $validator = useVuelidate({}, formState.value, {
  $scope: validationScope.scopeKey,
});

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
        :grid-size="formStyleApi.gridSize"
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
