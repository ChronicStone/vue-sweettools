import { FormField } from "@/types/form/fields";
import { resolveFieldDependencies } from "./resolveFieldDependencies";
import { getPropertyFromPath } from "./getPropertyFromPath";

function appendExtraProperties(
  fields: Array<FormField>,
  fieldState: Record<string, unknown>
) {
  const extraProperties: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fieldState)) {
    if (!fields.some((field) => field.key === key))
      extraProperties[key] = value;
  }
  return extraProperties;
}

export function mapFieldsInitialState(
  inputState: Record<string, unknown>,
  fields: Array<FormField & { _stepRoot?: string }> = [],
  virtualStore: Record<string, unknown>,
  parentKeys: string[] = [],
  rootState: Record<string, unknown> = inputState
) {
  const state: Record<string, any> = {};
  for (const field of fields) {
    if (field.type === "info") continue;
    const fieldValue = getPropertyFromPath(
      [...(field._stepRoot ? [field._stepRoot] : []), ...parentKeys, field.key],
      rootState
    );

    let fieldOutput: unknown = fieldValue;

    if (["array-list", "array-tabs"].includes(field.type)) {
      fieldOutput = ((fieldValue ?? []) as Array<unknown>).map(
        (itemValue, index) => ({
          ...("extraProperties" in field && field.extraProperties === true
            ? appendExtraProperties(
                field.fields,
                itemValue as Record<string, unknown>
              )
            : {}),
          ...getNestedFieldOutput(
            "input",
            inputState,
            rootState,
            virtualStore,
            field,
            parentKeys,
            index
          ),
        })
      );
    }

    if (field.type === "object" || field.type === "group") {
      fieldOutput = {
        ...("extraProperties" in field && field.extraProperties === true
          ? appendExtraProperties(field.fields, fieldValue)
          : {}),
        ...getNestedFieldOutput(
          "input",
          inputState,
          rootState,
          virtualStore,
          field,
          parentKeys
        ),
      };
    }

    if (!fieldOutput) fieldOutput = getFallbackFieldValue(field);

    if (field._stepRoot && !parentKeys.length) {
      state[field._stepRoot as string] = {};
      state[field._stepRoot as string][field.key] = getPreformatedField(
        fieldOutput,
        fieldValue,
        field
      );
    } else
      state[field.key] = getPreformatedField(fieldOutput, fieldValue, field);
  }

  return unwrapProxy(state);
}

export function mapFieldsOutputState(
  inputState: Record<string, unknown>,
  fields: Array<FormField & { _stepRoot?: string }> = [],
  virtualStore: Record<string, unknown>,
  parentKeys: string[] = [],
  rootState: Record<string, unknown> = inputState
) {
  const state: Record<string, any> = {};
  for (const field of fields) {
    if (field.type === "info") continue;
    const fieldValue = getPropertyFromPath(
      [...(field._stepRoot ? [field._stepRoot] : []), ...parentKeys, field.key],
      rootState
    );
    const fieldDependencies = resolveFieldDependencies(
      field,
      rootState,
      parentKeys
    );

    const includeField = !field.condition
      ? true
      : field.condition(fieldDependencies, {}) ||
        field?.conditionEffect !== "hide";

    if (!includeField) continue;
    let fieldOutput = fieldValue;

    if (["array-list", "array-tabs"].includes(field.type)) {
      fieldOutput = ((fieldValue ?? []) as Array<unknown>).map(
        (itemValue, index) => ({
          ...("extraProperties" in field && field.extraProperties === true
            ? appendExtraProperties(
                field.fields,
                itemValue as Record<string, unknown>
              )
            : {}),
          ...getNestedFieldOutput(
            "output",
            inputState,
            rootState,
            virtualStore,
            field,
            parentKeys,
            index
          ),
        })
      );
    }

    if (field.type === "object" || field.type === "group") {
      fieldOutput = {
        ...("extraProperties" in field && field.extraProperties === true
          ? appendExtraProperties(field.fields, fieldValue)
          : {}),
        ...getNestedFieldOutput(
          "output",
          inputState,
          rootState,
          virtualStore,
          field,
          parentKeys
        ),
      };
    }

    if (field._stepRoot && !parentKeys.length) {
      state[field._stepRoot as string] = {};
      state[field._stepRoot as string][field.key] = getTransformedField(
        fieldOutput,
        field
      );
    } else state[field.key] = getTransformedField(fieldOutput, field);
  }

  return unwrapProxy(state);
}

function getTransformedField(value: unknown, field: FormField) {
  return field.transform?.(value) ?? value;
}

function getPreformatedField(
  value: unknown,
  rawValue: unknown,
  field: FormField
) {
  return field?.preformat?.(rawValue) ?? value;
}

function unwrapProxy(data: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(data));
}

function getNestedFieldOutput(
  mode: "input" | "output",
  inputState: Record<string, unknown>,
  rootState: Record<string, unknown>,
  virtualDeps: Record<string, unknown>,
  field: FormField & { _stepRoot?: string },
  parentKeys: string[],
  index?: number
) {
  const hasRoot = field._stepRoot && !parentKeys.length;
  const executor =
    mode === "input" ? mapFieldsInitialState : mapFieldsOutputState;

  const fieldValue = getPropertyFromPath(
    [
      ...(hasRoot ? [field._stepRoot as string] : []),
      field.key,
      ...(typeof index === "number" ? [index.toString()] : []),
    ],
    inputState
  );

  return executor(
    fieldValue,
    field.fields,
    virtualDeps,
    [
      ...parentKeys,
      field.key,
      ...(typeof index === "number" ? [index.toString()] : []),
    ],
    rootState
  );
}

function getFallbackFieldValue(field: FormField) {
  if (field.default) return field.default;
  switch (field.type) {
    case "array-list":
    case "array-tabs":
    case "checkbox-group":
    case "tag":
      return [];
    case "object":
      return {};
    case "text":
    case "textarea":
    case "password":
      return "";
    case "cascader":
    case "select":
    case "tree-select":
      return field?.multiple ? [] : null;
    case "checkbox":
    case "switch":
      return false;
    case "rating":
    case "number":
    case "slider":
      return 0;
    case "radio":
    default:
      return null;
  }
}
