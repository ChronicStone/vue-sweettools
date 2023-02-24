import { ComputedRef } from "vue";
import {
  FormSchema,
  SimpleFormSchema,
  SteppedFormSchema,
} from "@/types/form/form";
import { FormField } from "@/types/form/fields";

export function useFormFields(formSchema: ComputedRef<FormSchema>) {
  return computed(
    () =>
      ((formSchema.value as SimpleFormSchema)?.fields ??
        (formSchema.value as SteppedFormSchema).steps
          .map((step, _stepIndex) =>
            step.fields.map((field: any) => ({
              ...field,
              _stepIndex,
              ...(step.root ? { _stepRoot: step.root } : {}),
            }))
          )
          .flat()) as Array<FormField & { _stepRoot?: string }>
  );
}
