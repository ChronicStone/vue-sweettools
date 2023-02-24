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
import { Ref } from "vue";

export function useForm<
  TFormSchema extends FormSchema<StepKey, FieldKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable
>(formRef: Ref<FormRefInstance | undefined>, schema: TFormSchema) {
  return {
    validate: formRef.value?.$validate,
    formData: computed(
      () =>
        (formRef.value?.$data ??
          {}) as TFormSchema extends SimpleFormSchema<FieldKey>
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
    ),
  };
}
