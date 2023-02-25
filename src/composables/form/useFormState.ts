import { ComputedRef } from "vue";
import { FormField } from "@/types/form/fields";
import { mapFieldsInitialState } from "@/utils/form/mapFieldsInitialState";

const [useProvideFormState, _useFormState] = createInjectionState(
  (
    fields: ComputedRef<Array<FormField & { _stepRoot?: string }>>,
    formData: { [key: string]: any }
  ) => {
    const formState = ref<{ [key: string]: any }>(
      mapFieldsInitialState(fields.value, formData)
    );
    const outputFormState = computed(() => formState.value);

    function reset() {
      formState.value = {};
    }

    return { formState, outputFormState, reset };
  }
);

function useFormState() {
  const state = _useFormState();
  if (!state) throw Error("Missing parent state provier");

  return state;
}

export { useProvideFormState, useFormState };
