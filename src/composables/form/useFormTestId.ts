import { FormSchema } from "@/types/form/form";
import { ComputedRef } from "vue";

const [useProvideFormTestId, _useFormTestId] = createInjectionState(
  (formSchema: ComputedRef<FormSchema>) => {
    return computed(() => formSchema.value?.testId ?? generateUUID());
  }
);

function useFormTestId() {
  const formTestId = _useFormTestId();
  if (!formTestId) {
    throw new Error("useFormTestId must be used within a Form component");
  }
  return formTestId;
}

export { useProvideFormTestId, useFormTestId };
