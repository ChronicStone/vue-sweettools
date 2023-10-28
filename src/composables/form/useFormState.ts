import { _FieldOptions } from "@/types/form/fields";
import { FormSharedStore } from "@/types/form/form";
import { ComputedRef } from "vue";
import { FormField } from "@/types/form/fields";
import {
  mapFieldsInitialState,
  mapFieldsOutputState,
} from "@/utils/form/mapFieldsInitialState";

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

    return { formState, outputFormState, contextMap, reset };
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
