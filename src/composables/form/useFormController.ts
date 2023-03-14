import {
  ExpandRecursively,
  ExtractFieldsFromSteps,
  FormInfoReturnType,
  FormSchema,
  Narrowable,
  SimpleFormSchema,
  SteppedFormSchema,
} from "@/types/form/form";
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
  formData: ComputedRef<
    TFormSchema extends SimpleFormSchema<FieldKey>
      ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>
      : TFormSchema extends SteppedFormSchema<StepKey, FieldKey>
      ? ExpandRecursively<
          ExtractFieldsFromSteps<
            StepKey,
            FieldKey,
            TFormSchema["steps"][number]
          >
        >
      : never
  >;
  nextStep: () => Promise<boolean>;
  previousStep: () => void;
} {
  return {
    schema,
    validate: async () => {
      return (await formRef.value?.$validate()) ?? false;
    },
    formData: computed(() => formRef.value?.$data ?? {}) as ComputedRef<
      TFormSchema extends SimpleFormSchema<FieldKey>
        ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>
        : TFormSchema extends SteppedFormSchema<StepKey, FieldKey>
        ? ExpandRecursively<
            ExtractFieldsFromSteps<
              StepKey,
              FieldKey,
              TFormSchema["steps"][number]
            >
          >
        : never
    >,
    nextStep: async () => {
      return (await formRef.value?.nextStep?.()) ?? false;
    },
    previousStep: () => formRef?.value?.previousStep?.(),
  };
}

export function buildFormSchema<
  TFormSchema extends FormSchema<StepKey, FieldKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable
>(schema: TFormSchema): TFormSchema {
  return schema;
}
