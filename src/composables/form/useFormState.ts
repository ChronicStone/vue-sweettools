import { FormSchema } from "@/types/form/form";
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
    storeConfig: FormSchema["sharedStore"]
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

    const virtualStore = asyncComputed<Record<string, unknown>>(() => {
      if (!Object.keys(storeConfig ?? {}).length) return false;
      return Object.entries(storeConfig ?? {}).reduce(
        async (acc, [key, item]) => {
          return {
            ...acc,
            [key]:
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
          };
        },
        {}
      );
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
