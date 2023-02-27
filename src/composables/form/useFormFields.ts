import { ComputedRef } from "vue";
import {
  FormSchema,
  SimpleFormSchema,
  SteppedFormSchema,
} from "@/types/form/form";
import { FieldInstance, StepInstance } from "@/types/form/instance";

export function useFormFields(formSchema: ComputedRef<FormSchema>) {
  const formFields = computed<FieldInstance[]>(
    () =>
      (formSchema.value as SimpleFormSchema)?.fields ??
      (formSchema.value as SteppedFormSchema).steps
        .map((step, _stepIndex) =>
          step.fields.map((field: any) => ({
            ...field,
            _stepIndex,
            ...(step.root ? { _stepRoot: step.root } : {}),
          }))
        )
        .flat()
  );

  const filteredFormFields = computed(() =>
    !isMultiStep.value
      ? formFields.value
      : formFields.value.filter(
          (field) => field._stepIndex === currentStep.value
        )
  );

  const isMultiStep = computed(() => formSteps.value?.length > 1);
  const currentStep = ref<number>(0);
  const formSteps = ref<StepInstance[]>(
    (formSchema.value as SteppedFormSchema).steps?.length
      ? (formSchema.value as SteppedFormSchema).steps.map(
          ({ fields, ...step }: any, stepIndex: number) => ({
            ...step,
            _status: stepIndex === 0 ? "InProgress" : "Pending",
            _index: stepIndex,
          })
        )
      : []
  );

  return {
    formFields,
    filteredFormFields,
    isMultiStep,
    currentStep,
    formSteps,
  };
}
