import { ObjectField } from "@/types/form/fields";
import { FieldInstance } from "@/types/form/instance";
import { GenericObject } from "@/types/utils";
import { getPropertyFromPath } from "@/utils/form/getPropertyFromPath";
import { resolveFieldDependencies } from "@/utils/form/resolveFieldDependencies";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { ComputedRef, Ref } from "vue";

const [useProvideFormValidation, _useFormValidation] = createInjectionState(
  (
    formFields: ComputedRef<Array<FieldInstance>>,
    formState: Ref<GenericObject>,
    virtualStore: Ref<Record<string, unknown>>
  ) => {
    const libConfig = useGlobalConfig();

    const formRules = ref<GenericObject>({});
    const $validator = useVuelidate(formRules, formState.value);

    watch(
      [() => formState.value, () => formFields.value],
      async ([state, fields]) => {
        formRules.value = await mapFormFules(fields, state);
      },
      { immediate: true, deep: true }
    );

    async function mapFormFules(
      fields: typeof formFields.value,
      state: GenericObject,
      parentKey: string[] = []
    ) {
      const rules: GenericObject = {};
      for (const field of fields) {
        if (field.type === "info") continue;
        const fieldValue = getPropertyFromPath(
          [...parentKey, field.key],
          state
        );
        const dependencies = resolveFieldDependencies(field, state, parentKey);

        const condition =
          (await field?.condition?.(dependencies, virtualStore.value)) ?? true;
        if (!condition && (field?.conditionEffect ?? "hide") === "hide")
          continue;

        let fieldRules: GenericObject = {
          ...(rules?.[field.key] ?? {}),
        };

        const isRequired =
          typeof field.required === "function"
            ? field.required(dependencies, virtualStore.value)
            : field?.required ?? false;

        if (isRequired)
          fieldRules.required = helpers.withMessage(
            typeof libConfig.getProp("textOverrides.requiredMessage") ===
              "function"
              ? (
                  libConfig.getProp("textOverrides.requiredMessage") as (
                    label: string | (() => string)
                  ) => string
                )?.(
                  typeof field.label === "function"
                    ? field
                        .label(dependencies, virtualStore.value)
                        ?.toString() ?? ""
                    : field?.label ?? field.key
                )
              : (libConfig.getProp("textOverrides.requiredMessage") as string),
            field.type === "checkbox" ? (value: boolean) => !!value : required
          );

        if (field.type === "object") {
          const newRules = await mapFormFules(
            (field as ObjectField).fields,
            state,
            [...parentKey, field.key]
          );
          fieldRules = {
            ...fieldRules,
            ...newRules,
          };
        }

        if (field.type === "array-list" || field.type === "array-tabs") {
          const arrayItemsRules = await Promise.all(
            (fieldValue as GenericObject[]).map((_, index) =>
              mapFormFules(field.fields, state, [
                ...parentKey,
                field.key,
                index.toString(),
              ])
            )
          );

          fieldRules = {
            ...fieldRules,
            ...arrayToObject(arrayItemsRules),
          };
        }

        if (field.type === "array-variant") {
          const arrayItemsRules = await Promise.all(
            (fieldValue as GenericObject[]).map((itemValue, index) => {
              const fields =
                field.variants.find(
                  (variant) => variant.key === itemValue[field.variantKey]
                )?.fields ?? [];

              return mapFormFules(fields, state, [
                ...parentKey,
                field.key,
                index.toString(),
              ]);
            })
          );

          fieldRules = {
            ...fieldRules,
            ...arrayToObject(arrayItemsRules),
          };
        }

        if (typeof field?.validators === "function")
          fieldRules = {
            ...fieldRules,
            ...field.validators(dependencies, virtualStore.value),
          };
        if (typeof field?.validators === "object")
          fieldRules = { ...fieldRules, ...field.validators };

        if (
          typeof field._stepRoot === "string" &&
          field._stepRoot &&
          !parentKey.length
        ) {
          if (
            !rules[field._stepRoot] ||
            typeof rules[field._stepRoot] !== "object"
          )
            rules[field._stepRoot] = {};
          (rules[field._stepRoot] as GenericObject)[field.key] = fieldRules;
        } else rules[field.key] = fieldRules;
      }

      return rules;
    }

    return { $validator };
  }
);

function useFormValidation() {
  const validationApi = _useFormValidation();
  if (!validationApi)
    throw new Error("No parent validation API on current scope");

  return validationApi;
}

export { useProvideFormValidation, useFormValidation };
