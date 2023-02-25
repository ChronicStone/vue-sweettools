import { ComputedRef } from "vue";
import { FormField } from "@/types/form/fields";

const [useProvideFormState, _useFormState] = createInjectionState(
  (
    fields: ComputedRef<Array<FormField & { _stepRoot?: string }>>,
    formData: { [key: string]: any }
  ) => {
    const formState = ref<{ [key: string]: any }>({});
    const outputFormState = computed(() => formState.value);

    function reset() {
      formState.value = {};
    }

    function mapInitialState(
      fields: Array<FormField & { _stepRoot?: string }>,
      inputFormData: { [key: string]: any } = {},
      fieldKey = ""
    ) {
      const state: { [key: string]: any } = {};
      fields.forEach((field) => {
        if (field.type === "info") return;
        const GetFieldState = () => {
          if (!["array", "object"].includes(field.type))
            return inputFormData?.[field.key]
              ? field?.preformat && typeof field?.preformat === "function"
                ? field.preformat(inputFormData?.[field.key])
                : inputFormData?.[field.key]
              : field?.default
              ? field?.default
              : field.type === "checkbox"
              ? false
              : field.type === "number"
              ? 0
              : null;
          else if (field.type === "array")
            return field?.preformat && typeof field?.preformat === "function"
              ? field.preformat(
                  inputFormData[field.key] ?? field?.default ?? []
                )
              : inputFormData[field.key] ?? field?.default ?? [];
          else
            return field?.preformat && typeof field?.preformat === "function"
              ? field.preformat(
                  mapInitialState(
                    field.fields ?? [],
                    inputFormData[field.key] ?? {},
                    field.key
                  )
                )
              : mapInitialState(
                  field.fields ?? [],
                  inputFormData[field.key] ?? {},
                  field.key
                );
        };
        if (field._stepRoot) {
          if (!state[field._stepRoot]) state[field._stepRoot] = {};
          state[field._stepRoot][field.key] = GetFieldState();
        } else state[field.key] = GetFieldState();
      });
      return state;
    }

    onMounted(
      () => (formState.value = mapInitialState(fields.value, formData))
    );

    return { formState, outputFormState, reset };
  }
);

function useFormState() {
  const state = _useFormState();
  if (!state) throw Error("Missing parent state provier");

  return state;
}

export { useProvideFormState, useFormState };
