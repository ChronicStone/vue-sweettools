import { SelectField } from "@/types/form/fields";
import { FormField } from "@/types/form/fields";
import { GenericObject } from "@/types/utils";
import { getPropertyFromPath } from "@/utils/form/getPropertyFromPath";
import {
  mapFieldDependencies,
  preformatFieldDependencies,
} from "@/utils/form/mapFieldDependencies";
import { mapFieldProps } from "@/utils/form/mapFieldProps";
import { CascaderOption, SelectOption, TreeSelectOption } from "naive-ui";
import { Ref, ComputedRef, WritableComputedRef } from "vue";

export function useFieldContext(
  field: ComputedRef<FormField>,
  fieldState: WritableComputedRef<unknown>,
  state: Ref<GenericObject>,
  parentKey: ComputedRef<string[]>
) {
  const fieldId = generateUUID();
  const fieldFullPath = computed(() => [
    ...(parentKey.value ?? []),
    field.value.key,
  ]);

  const inputProps = computed(() =>
    mapFieldProps(field.value.type, field.value?.fieldParams ?? {})
  );

  const required = computed(() =>
    typeof field.value.required === "function"
      ? field.value.required(dependencies.value)
      : !!field.value.required
  );

  const condition = ref<boolean>(true);
  const _evalCondition = ref<boolean>(false);
  const conditionEffect = computed(
    () => field.value?.conditionEffect ?? "hide"
  );

  const _evalOptions = ref<boolean>(false);
  const options = ref(
    mapOptions(
      Array.isArray((field.value as SelectField).options)
        ? ((field.value as SelectField).options as unknown as (
            | SelectOption
            | TreeSelectOption
            | CascaderOption
          )[])
        : []
    )
  );

  const dependencies = computed(() =>
    mapFieldDependencies(
      preformatFieldDependencies(
        field.value?.dependencies ?? [],
        state.value,
        parentKey.value
      )
    )
  );

  watch(
    () => options.value,
    (fieldOptions: SelectOption[]) => {
      try {
        const optionValues = fieldOptions.map((option) => option.value) ?? [];
        if (Array.isArray(fieldState.value))
          setPropertyFromPath(
            state.value,
            [...(parentKey.value ?? []), field.value.key],
            fieldState.value.filter((item: any) => optionValues.includes(item))
          );
        else if (!optionValues.includes(fieldState.value as string | number))
          setPropertyFromPath(
            state.value,
            [...(parentKey.value ?? []), field.value.key],
            null
          );
      } catch (err) {
        console.error(err);
      }
    },
    {
      immediate: true,
    }
  );

  if (typeof field.value?.watch === "function") {
    watch(
      () => getPropertyFromPath(fieldFullPath.value, state.value),
      (value: unknown) =>
        (field.value.watch as NonNullable<FormField["watch"]>)(value, {
          setValue: (key: string, value: any) =>
            setPropertyFromPath(state.value, key.split("."), value),
          getValue: (key: string) => getPropertyFromPath(key, state.value),
        })
    );
  }

  async function resolveFieldOptions(deps: GenericObject) {
    _evalOptions.value = true;
    try {
      options.value = mapOptions(
        await ((field.value as SelectField).options as (...args: any[]) => any)(
          {
            ...deps,
          }
        )
      );
    } catch (err) {
      console.error(`FIELD ${field.value.key} async options exec. failed`, err);
    } finally {
      _evalOptions.value = false;
    }
  }

  async function resolveFieldCondition(deps: GenericObject) {
    _evalCondition.value = true;
    try {
      condition.value = await (
        field.value.condition as (...args: any[]) => any
      )({
        ...deps,
      });
    } catch (err) {
      console.error(`FIELD ${field.value.key} condition exec. failed`, err);
    } finally {
      _evalCondition.value = false;
    }
  }

  watch(
    () => dependencies.value,
    (deps) => {
      if (field.value.condition) resolveFieldCondition(deps);
      if (typeof (field.value as SelectField).options === "function")
        resolveFieldOptions(deps);
    },
    { deep: true, immediate: true }
  );

  return {
    _evalCondition,
    _evalOptions,
    fieldId,
    fieldFullPath,
    required,
    condition,
    conditionEffect,
    options,
    dependencies,
    inputProps,
  };
}

function mapOptions(
  options: unknown[]
): (SelectOption | TreeSelectOption | CascaderOption)[] {
  if (options.every((option) => ["number", "string"].includes(typeof option)))
    return options.map((option) => ({
      label: option,
      value: option,
    })) as (SelectOption | TreeSelectOption | CascaderOption)[];
  else return options as (SelectOption | TreeSelectOption | CascaderOption)[];
}
