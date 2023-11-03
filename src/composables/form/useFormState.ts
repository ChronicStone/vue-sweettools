import { FieldApi, _FieldOptions } from "@/types/form/fields";
import { ComputedRef } from "vue";
import { FormField } from "@/types/form/fields";
import {
  mapFieldsInitialState,
  mapFieldsOutputState,
} from "@/utils/form/mapFieldsInitialState";
import { get } from "@vueuse/core";
import { SelectOption, TreeSelectOption, CascaderOption } from "naive-ui";

const [useProvideFormState, _useFormState] = createInjectionState(
  (
    fields: ComputedRef<Array<FormField & { _stepRoot?: string }>>,
    formData: Record<string, unknown> | undefined
  ) => {
    const formState = ref<{ [key: string]: any }>(
      mapFieldsInitialState(formData ?? {}, fields.value)
    );
    const outputFormState = computed(() =>
      mapFieldsOutputState({ ...formState.value }, fields.value)
    );

    function reset(clear = false) {
      formState.value = mapFieldsInitialState(
        clear ? {} : formData ?? {},
        fields.value
      );
    }

    const contextMap = ref<Map<string, ReturnType<typeof useFieldContext>>>(
      new Map()
    );

    function getFieldApi(key: string, parentKey: string[]): FieldApi {
      const fieldFullPath = [...parentKey, key];
      const getValue: FieldApi["getValue"] = (key) =>
        propertyResolver(key, parentKey, formState.value);

      const setValue: FieldApi["setValue"] = (...args: any[]) => {
        if (typeof args[0] !== "undefined" && typeof args[1] !== "undefined") {
          const key = args[0] as string;
          const value = args[1] as unknown;
          propertySetter(key, parentKey, formState.value, value);
        } else {
          const value = args[0] as unknown;
          propertySetter(
            fieldFullPath.join("."),
            parentKey,
            formState.value,
            value
          );
        }
      };

      const getOptions: FieldApi["getOptions"] = <
        T extends
          | SelectOption
          | TreeSelectOption
          | CascaderOption
          | string
          | number = SelectOption | TreeSelectOption | CascaderOption,
        O = T extends string | number ? { label: string; value: T } : T
      >(
        key?: string
      ) => {
        const _key = !key ? fieldFullPath.join(".") : key;
        const contextPath = getPropertyFullPath(_key, parentKey);
        const _context = contextMap.value.get(contextPath.join("."));

        if (!_context)
          throw new Error(
            `Context not found for path ${contextPath.join(".")}`
          );

        return get(_context._options) as O[];
      };

      return { getValue, setValue, getOptions };
    }

    return { formState, outputFormState, contextMap, getFieldApi, reset };
  }
);

function useFormState() {
  const state = _useFormState();
  if (!state) throw Error("Missing parent state provier");

  return state;
}

export { useProvideFormState, useFormState };

// async function runStateSideEffects(
//   fields: FieldInstance[],
//   state: GenericObject,
//   virtualStore: GenericObject,
//   parentKey: string[] = []
// ) {
//   for (const field of fields) {
//     const fieldValue = getPropertyFromPath([...parentKey, field.key], state);
//     const dependencies = resolveFieldDependencies(field, state, parentKey);
//     const virtualDependencies = mapFieldDependencies(
//       preformatFieldDependencies(field?.virtualDependencies ?? [], virtualStore)
//     );

//     const condition =
//       (field?.conditionEffect ?? "hide") === "hide"
//         ? true
//         : (await field?.condition?.(dependencies, virtualDependencies)) ?? true;

//     if (condition && field.type !== "array-list") return false;

//     if (field.type === 'select') {
//       const _options = field.options as
//         | (number | string)[]
//         | SelectOption[]
//         | TreeSelectOption[]
//         | CascaderOption[];
//     }
//   }
// }

// function validateFieldOptionValue(field) {

// }
