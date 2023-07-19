import { FormField } from "@/types/form/fields";
import { resolveFieldDependencies } from "./resolveFieldDependencies";
import { getPropertyFromPath } from "./getPropertyFromPath";
import { GenericObject } from "@/types/utils";

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
  const state: GenericObject = {};
  for (const field of fields) {
    if (field.type === "info") continue;
    const fieldValue = getPropertyFromPath(
      [...(field._stepRoot ? [field._stepRoot] : []), ...parentKeys, field.key],
      rootState
    );

    let fieldOutput: unknown = fieldValue;

    if (
      field.type === "array-list" ||
      field.type === "array-tabs" ||
      field.type === "array-variant"
    ) {
      fieldOutput = ((fieldValue ?? []) as Array<Record<string, unknown>>).map(
        (itemValue, index) => {
          let fields: Array<FormField>;
          let variantKey = "";
          if (field.type === "array-variant") {
            variantKey = field.variantKey;
            fields =
              field.variants.find((v) => v.key === itemValue[variantKey])
                ?.fields ?? [];
          } else {
            fields = field.fields;
          }
          return {
            ...("extraProperties" in field && field.extraProperties === true
              ? appendExtraProperties(
                  fields,
                  itemValue as Record<string, unknown>
                )
              : {}),
            ...getNestedFieldOutput(
              "input",
              inputState,
              rootState,
              virtualStore,
              field.type === "array-variant"
                ? {
                    ...field,
                    type: "array-tabs",
                    fields,
                  }
                : field,
              parentKeys,
              index
            ),
            ...(variantKey ? { [variantKey]: itemValue[variantKey] } : {}),
          };
        }
      );
    } else if (field.type === "object" || field.type === "group") {
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
    const finalFieldValue = getPreformatedField(fieldOutput, fieldValue, field);

    if (
      typeof field._stepRoot === "string" &&
      field._stepRoot &&
      !parentKeys.length
    ) {
      if (!state[field._stepRoot] || typeof state[field._stepRoot] !== "object")
        state[field._stepRoot] = {};
      (state[field._stepRoot] as GenericObject)[field.key] = finalFieldValue;
    } else state[field.key] = finalFieldValue;
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

    if (
      field.type === "array-list" ||
      field.type === "array-tabs" ||
      field.type === "array-variant"
    ) {
      fieldOutput = ((fieldValue ?? []) as Array<Record<string, unknown>>).map(
        (itemValue, index) => {
          let fields: Array<FormField>;
          let variantKey = "";
          if (field.type === "array-variant") {
            variantKey = field.variantKey;
            fields =
              field.variants.find((v) => v.key === itemValue[variantKey])
                ?.fields ?? [];
          } else {
            fields = field.fields;
          }

          return {
            ...("extraProperties" in field && field.extraProperties === true
              ? appendExtraProperties(
                  fields,
                  itemValue as Record<string, unknown>
                )
              : {}),
            ...getNestedFieldOutput(
              "output",
              inputState,
              rootState,
              virtualStore,
              field.type === "array-variant"
                ? {
                    ...field,
                    type: "array-tabs",
                    fields,
                  }
                : field,
              parentKeys,
              index
            ),
            ...(variantKey ? { [variantKey]: itemValue[variantKey] } : {}),
          };
        }
      );
    } else if (field.type === "object" || field.type === "group") {
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
      if (!state[field._stepRoot as string])
        state[field._stepRoot as string] = {};
      state[field._stepRoot as string][field.key] = getTransformedField(
        fieldOutput,
        field
      );
    } else {
      state[field.key] = getTransformedField(fieldOutput, field);
    }
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
