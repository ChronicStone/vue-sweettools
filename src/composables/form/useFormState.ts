import { _FieldOptions } from "@/types/form/fields";
import { FormSharedStore } from "@/types/form/form";
import { ComputedRef } from "vue";
import { FormField } from "@/types/form/fields";
import {
  mapFieldsInitialState,
  mapFieldsOutputState,
} from "@/utils/form/mapFieldsInitialState";
import {
  mapFieldDependencies,
  preformatFieldDependencies,
} from "@/utils/form/mapFieldDependencies";

const [useProvideFormState, _useFormState] = createInjectionState(
  (
    fields: ComputedRef<Array<FormField & { _stepRoot?: string }>>,
    formData: Record<string, unknown> | undefined,
    storeConfig: FormSharedStore<string> | undefined
  ) => {
    const formState = ref<{ [key: string]: any }>(
      mapFieldsInitialState(formData ?? {}, fields.value, {})
    );
    const outputFormState = computed(() =>
      mapFieldsOutputState(
        { ...formState.value },
        fields.value,
        virtualStore.value
      )
    );

    function reset(clear = false) {
      formState.value = mapFieldsInitialState(
        clear ? {} : formData ?? {},
        fields.value,
        virtualStore.value
      );
    }

    const virtualStore = asyncComputed<Record<string, unknown>>(async () => {
      if (!storeConfig?.length) return {};
      return (
        await Promise.all(
          (storeConfig ?? []).map(async (item) => ({
            key: item.key,
            value:
              typeof item.value === "function"
                ? await item.value(
                    mapFieldDependencies(
                      preformatFieldDependencies(
                        item?.dependencies ?? [],
                        formState.value
                      )
                    )
                  )
                : item.value,
          }))
        )
      ).reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});

      // .reduce(async (acc, item) => {
      //   return {
      //     ...acc,
      //     [item.key]: "hehe",
      //     // typeof item.value === "function"
      //     //   ? await item.value(
      //     //       mapFieldDependencies(
      //     //         preformatFieldDependencies(
      //     //           item?.dependencies ?? [],
      //     //           formState.value
      //     //         )
      //     //       )
      //     //     )
      //     //   : item.value,
      //   };
      // }, {});
    }, {});

    return { formState, outputFormState, virtualStore, reset };
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
