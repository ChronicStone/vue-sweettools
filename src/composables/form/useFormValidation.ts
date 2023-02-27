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
    formState: Ref<GenericObject>
  ) => {
    const libConfig = useGlobalConfig();

    const formRules = computed(() =>
      mapFormFules(formFields.value, formState.value)
    );
    const $validator = useVuelidate(formRules, formState.value);

    function mapFormFules(
      fields: typeof formFields.value,
      state: GenericObject,
      parentKey: string[] = []
    ) {
      const rules: GenericObject = {};
      for (const field of fields) {
        const fieldValue = getPropertyFromPath(
          [...parentKey, field.key],
          state
        );
        const dependencies = resolveFieldDependencies(field, state, parentKey);
        const condition = field?.condition?.(dependencies) ?? true;

        if (!condition && (field?.conditionEffect ?? "hide") === "hide")
          continue;

        let fieldRules: GenericObject = {
          ...(rules?.[field.key] ?? {}),
        };

        const isRequired =
          typeof field.required === "function"
            ? field.required(dependencies)
            : field?.required ?? false;

        if (field.type === "object") {
          fieldRules = {
            ...fieldRules,
            ...mapFormFules((field as ObjectField).fields, state, [
              ...parentKey,
              field.key,
            ]),
          };
        }

        if (field.type === "array-list" || field.type === "array-tabs") {
          fieldRules = {
            ...fieldRules,
            ...arrayToObject(
              (fieldValue as GenericObject[]).map((_, index) => ({
                ...mapFormFules(field.fields, state, [
                  ...parentKey,
                  field.key,
                  index,
                ]),
              }))
            ),
          };
        }

        if (typeof field?.validators === "function")
          fieldRules = { ...fieldRules, ...field.validators(dependencies) };
        if (typeof field?.validators === "object")
          fieldRules = { ...fieldRules, ...field.validators };

        if (isRequired)
          fieldRules.required = helpers.withMessage(
            typeof libConfig.getProp("textOverrides.requiredMessage") ===
              "function"
              ? (
                  libConfig.getProp("textOverrides.requiredMessage") as (
                    label: string
                  ) => string
                )?.(field?.label ?? field.key)
              : (libConfig.getProp("textOverrides.requiredMessage") as string),
            required
          );

        rules[field.key] = fieldRules;
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
