import { getPropertyFromPath } from "@/utils/form/getPropertyFromPath";
import { FormField } from "@/types/form/fields";
import { ComputedRef, Ref } from "vue";
import { helpers, required } from "@vuelidate/validators";

export function useFieldRules(
  field: FormField & { _stepIndex?: number },
  fieldContext: ReturnType<typeof useFieldContext>,
  fieldValue: Ref<unknown>,
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
            // REQUIRED FIELD HANDLER
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
            ...(typeof field?.validators === "function" && {
              ...field.validators(fieldContext.dependencies.value),
            }),
            ...(typeof field.validators === "object" && {
              ...field.validators,
            }),
          },
        }
  );

  return appliedRules;
}
