import { FormField } from "@/types/form/fields";

export function mapFieldsInitialState(
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
          ? field.preformat(inputFormData[field.key] ?? field?.default ?? [])
          : inputFormData[field.key] ?? field?.default ?? [];
      else
        return field?.preformat && typeof field?.preformat === "function"
          ? field.preformat(
              mapFieldsInitialState(
                field.fields ?? [],
                inputFormData[field.key] ?? {},
                field.key
              )
            )
          : mapFieldsInitialState(
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
