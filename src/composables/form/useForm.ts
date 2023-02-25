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
>(
  formRef: Ref<FormRefInstance | undefined>,
  schema: TFormSchema
): {
  validate(): Promise<boolean> | (() => boolean);
  formData: TFormSchema extends SimpleFormSchema<FieldKey>
    ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>
    : TFormSchema extends SteppedFormSchema<StepKey, FieldKey>
    ? ExpandRecursively<
        ExtractFieldsFromSteps<StepKey, FieldKey, TFormSchema["steps"][number]>
      >
    : never;
} {
  onMounted(() => {
    console.log({ formRef: formRef.value });
  });
  return {
    validate: async () => {
      console.log("validating", formRef.value);
      return (await formRef.value?.$validate()) ?? false;
    },
    formData: computed(() => formRef.value?.$data ?? {}) as any,
  };
}