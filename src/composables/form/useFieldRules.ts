import { FormField } from "@/types/form/fields";
import { ComputedRef } from "vue";
import { helpers, required } from "@vuelidate/validators";

export function useFieldRules(
  field: FormField & { _stepIndex?: number },
  fieldContext: ReturnType<typeof useFieldContext>,
  parentKey: ComputedRef<string[]>,
  multiStep: ComputedRef<boolean>,
  currentStep: ComputedRef<number | undefined>
) {
  const libConfig = useGlobalConfig();
  const fieldValidationActive = computed(() => {
    if (field.condition && !fieldContext.condition.value)
      return field.conditionEffect === "disable" ? true : false;

    if (
      multiStep.value &&
      field._stepIndex !== currentStep.value &&
      !parentKey.value.reverse()[0]
    )
      return false;
    return true;
  });

  const appliedRules = computed(() =>
    !fieldValidationActive.value
      ? {}
      : {
          [field.key]: {
            ...(fieldContext.required.value && {
              required: helpers.withMessage(
                typeof libConfig.getProp("textOverrides.requiredMessage") ===
                  "function"
                  ? (
                      libConfig.getProp("textOverrides.requiredMessage") as (
                        label: string
                      ) => string
                    )?.(field?.label ?? field.key)
                  : (libConfig.getProp(
                      "textOverrides.requiredMessage"
                    ) as string),
                required
              ),
            }),
          },
        }
  );

  return appliedRules;
}
