import { FormInferredData, FormSchema, Narrowable } from "@/types/form/form";
import { FormRefInstance } from "@/types/form/instance";
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
  };
}

export function buildFormSchema<
  TFormSchema extends FormSchema<StepKey, FieldKey, StoreKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable,
  StoreKey extends string
>(schema: TFormSchema): TFormSchema {
  return schema;
}
