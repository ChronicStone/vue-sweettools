import { FieldOptionCreator, SelectField } from "@/types/form/fields";
import { FormField } from "@/types/form/fields";
import { GenericObject } from "@/types/utils";
import { getPropertyFromPath } from "@/utils/form/getPropertyFromPath";
import {
  mapFieldDependencies,
  preformatFieldDependencies,
} from "@/utils/form/mapFieldDependencies";
import { mapFieldProps } from "@/utils/form/mapFieldProps";
import {
  CascaderOption,
  NButton,
  SelectOption,
  TreeSelectOption,
} from "naive-ui";
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

  const { invalidateFieldOptions, subscribeOptionsInvalidation } =
    useFormFields();

  const removeSubscription = subscribeOptionsInvalidation(
    (path) =>
      [...(parentKey.value ?? []), field.value.key].join(".") === path &&
      resolveOptions()
  );
  onScopeDispose(() => removeSubscription());

  async function createOption() {
    const _field = field.value as SelectField;
    if (!_field.createOption) return;

    _evalOptions.value = true;
    const selectOnCreation =
      typeof _field.createOption === "function"
        ? true
        : _field.createOption?.selectOnCreation ?? true;
    const handler =
      typeof _field.createOption === "function"
        ? _field.createOption
        : _field.createOption?.handler;

    const option = await handler(dependencies.value, virtualStore.value);
    if (!option) {
      _evalOptions.value = false;
      return;
    }

    _options.value = mapOptions([..._options.value, option]);
    if (selectOnCreation)
      nextTick(() => {
        const newVal = _options.value.at(-1)?.value;
        if (_field.multiple)
          fieldState.value = [...(fieldState.value as Array<any>), newVal];
        else fieldState.value = newVal;
      });
    _evalOptions.value = false;
    const revalidatePaths =
      typeof _field.createOption === "object"
        ? _field.createOption.revalidateFieldOptions ?? []
        : [];

    const mappedPaths = revalidatePaths.map((path) =>
      path.startsWith("$parent")
        ? mapRelativeKeyPath([...(parentKey.value ?? [])], path)
        : mapRelativeKeyPath(path)
    );

    for (const path of mappedPaths) invalidateFieldOptions(path.join("."));
  }

  async function resolveOptions() {
    if (!("options" in field.value)) return [];
    _evalOptions.value = true;
    const _field = field.value as SelectField;
    if (!_field.options) return [];
    else if (Array.isArray(_field.options))
      _options.value = mapOptions(_field.options);
    else
      _options.value = mapOptions(
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
  }

  const _evalOptions = ref<boolean>(false);
  const _options = ref<(CascaderOption | SelectOption | TreeSelectOption)[]>(
    []
  );
  watch(
    () => JSON.stringify(dependencies.value),
    async () => resolveOptions(),
    { immediate: true }
  );

  function selectActionFactory(_field: SelectField) {
    const createOptionsEnabled = typeof _field.createOption !== "undefined";
    const allowOptionsRefresh = _field?.allowOptionsRefresh ?? false;
    return {
      render: () => (
        <div
          class={`p-1 grid gap-2 ${
            createOptionsEnabled && allowOptionsRefresh
              ? "grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {typeof _field.createOption !== "undefined" && (
            <NButton
              class="!w-full"
              quaternary={true}
              onClick={() => createOption()}
            >
              {{
                icon: () => <span class="iconify" data-icon="mdi:plus" />,
                default: () => <span>Create item</span>,
              }}
            </NButton>
          )}
          {_field?.allowOptionsRefresh && (
            <NButton
              class="!w-full"
              quaternary={true}
              onClick={() => resolveOptions()}
            >
              {{
                icon: () => <span class="iconify" data-icon="mdi:refresh" />,
                default: () => <span>Refresh</span>,
              }}
            </NButton>
          )}
        </div>
      ),
    };
  }

  const options = computed(() => {
    return [
      ..._options.value,
      ...(("createOption" in field.value &&
        typeof field.value.createOption !== "undefined") ||
      ("allowRefreshOptions" in field.value && field.value.allowRefreshOptions)
        ? [selectActionFactory(field.value as SelectField)]
        : []),
    ];
  });

  if ("options" in field.value) {
    watch(
      () => _options.value,
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
  return options.map((option) =>
    ["number", "string"].includes(typeof option)
      ? {
          label: option,
          value: option,
        }
      : option
  ) as (SelectOption | TreeSelectOption | CascaderOption)[];
}
