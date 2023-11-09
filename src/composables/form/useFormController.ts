import { FormField } from "@/types/form/fields";
import {
  FormInferredData,
  FormSchema,
  FormSharedStore,
} from "@/types/form/form";
import { FormRefInstance } from "@/types/form/instance";
import { Narrowable } from "@/types/utils";
import { ComputedRef, Ref } from "vue";

export function useFormController<
  TFormSchema extends FormSchema<StepKey, FieldKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable
>(
  formRef: Ref<FormRefInstance | undefined>,
  schema: TFormSchema
): {
  schema: TFormSchema;
  validate(): Promise<boolean> | (() => boolean);
  formData: ComputedRef<FormInferredData<TFormSchema, StepKey, FieldKey>>;
  nextStep: () => Promise<boolean>;
  previousStep: () => void;
  currentStep: ComputedRef<number>;
  canTriggerNext: ComputedRef<boolean>;
  canTriggerPrevious: ComputedRef<boolean>;
  reset: (clear?: boolean) => void;
} {
  return {
    schema,
    validate: async () => {
      return (await formRef.value?.$validate()) ?? false;
    },
    formData: computed(() => formRef.value?.$data ?? {}) as ComputedRef<
      FormInferredData<TFormSchema, StepKey, FieldKey>
    >,
    nextStep: async () => {
      return (await formRef.value?.nextStep?.()) ?? false;
    },
    previousStep: () => formRef?.value?.previousStep?.(),
    currentStep: computed(() => formRef.value?.currentStep?.value ?? 0),
    canTriggerNext: computed(
      () => formRef.value?.canTriggerNext?.value ?? false
    ),
    canTriggerPrevious: computed(
      () => formRef.value?.canTriggerPrevious?.value ?? false
    ),
    reset: (clear?: boolean) => formRef.value?.$reset?.(clear),
  };
}

export function buildFormSchema<
  TFormSchema extends FormSchema<StepKey, FieldKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable
>(schema: TFormSchema) {
  return schema;
}

export function buildFormSchemaDist<
  TFormSchema extends FormSchema<StepKey, FieldKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable
>(schema: TFormSchema) {
  return schema;
}

export function buildFieldSchema<
  TField extends FormField<FieldKey>,
  FieldKey extends Narrowable
>(field: TField): TField {
  return field;
}

export function buildMultiFieldSchema<
  TField extends FormField<FieldKey>[],
  FieldKey extends Narrowable
>(fields: TField): TField {
  return fields;
}
