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
  virtualStore: Ref<Record<string, unknown>>,
  parentKey: ComputedRef<string[]>
) {
  const fieldId = generateUUID();
  const fieldFullPath = computed(() => [
    ...(parentKey.value ?? []),
    field.value.key,
  ]);

  const required = computed(() =>
    typeof field.value.required === "function"
      ? field.value.required(dependencies.value, virtualStore.value)
      : !!field.value.required
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

  const inputProps = computed(() =>
    mapFieldProps(
      field.value,
      field.value?.fieldParams ?? {},
      dependencies.value,
      virtualStore.value
    )
  );

  const rawInputProps = computed(() =>
    mapFieldProps(
      field.value,
      field.value?.fieldParams ?? {},
      dependencies.value,
      virtualStore.value,
      true
    )
  );

  const _evalCondition = ref<boolean>(false);
  const conditionEffect = computed(
    () => field.value?.conditionEffect ?? "hide"
  );
  const condition = computedAsync<boolean>(
    () =>
      field.value?.condition?.(dependencies.value, virtualStore.value) ?? true,
    false,
    _evalCondition
  );

  const disabled = computed(
    () =>
      (conditionEffect.value === "disable" && !condition.value) ||
      _evalOptions.value
  );

  const _evalOptions = ref<boolean>(false);
  const options = ref<(CascaderOption | SelectOption | TreeSelectOption)[]>([]);
  watch(
    () => JSON.stringify(dependencies.value),
    async () => {
      if (!("options" in field.value)) return [];
      _evalOptions.value = true;
      const _field = field.value as SelectField;
      if (!_field.options) return [];
      else if (Array.isArray(_field.options))
        options.value = mapOptions(_field.options);
      else
        options.value = mapOptions(
          Array.isArray((field.value as SelectField).options)
            ? ((field.value as SelectField).options as unknown as (
                | SelectOption
                | TreeSelectOption
                | CascaderOption
              )[])
            : typeof (field.value as SelectField).options === "function"
            ? await (
                (field.value as SelectField).options as (...args: any[]) => any
              )({ ...dependencies.value }, { ...virtualStore.value })
            : []
        );

      _evalOptions.value = false;
    },
    { immediate: true }
  );

  if ("options" in field.value) {
    watch(
      () => options.value,
      (fieldOptions: SelectOption[]) => {
        if (_evalOptions.value) return;
        try {
          const optionValues = fieldOptions.map((option) => option.value) ?? [];
          if (Array.isArray(fieldState.value))
            setPropertyFromPath(
              state.value,
              [...(parentKey.value ?? []), field.value.key],
              fieldState.value.filter((item: any) =>
                optionValues.includes(item)
              )
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
        deep: true,
      }
    );
  }

  if (typeof field.value?.watch === "function") {
    watch(
      () => getPropertyFromPath(fieldFullPath.value, state.value),
      (value: unknown) =>
        (field.value.watch as NonNullable<FormField["watch"]>)(value, {
          setValue: (key: string, value: any) =>
            propertySetter(key, parentKey.value, state.value, value),
          getValue: (key: string) =>
            propertyResolver(key, parentKey.value, state.value),
        })
    );
  }

  if (typeof field.value.onDependencyChange === "function") {
    watch(
      () => JSON.stringify(dependencies.value),
      () =>
        field.value.onDependencyChange?.(dependencies.value, {
          setValue: (value: unknown) => (fieldState.value = value),
          getValue: () => fieldState.value,
        })
    );
  }

  const placeholder = computed(() =>
    typeof field.value.placeholder === "function"
      ? field.value.placeholder()
      : field.value.placeholder
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
    rawInputProps,
    placeholder,
    virtualStore,
    disabled,
    parentKey,
  };
}

function mapOptions(
  options: unknown[]
): (SelectOption | TreeSelectOption | CascaderOption)[] {
  if (!Array.isArray(options)) return [];
  if (options.every((option) => ["number", "string"].includes(typeof option)))
    return options.map((option) => ({
      label: option,
      value: option,
    })) as (SelectOption | TreeSelectOption | CascaderOption)[];
  else return options as (SelectOption | TreeSelectOption | CascaderOption)[];
}
