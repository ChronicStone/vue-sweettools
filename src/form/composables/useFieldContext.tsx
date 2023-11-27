/* eslint-disable ts/no-use-before-define */
import {
  type CascaderOption,
  NButton,
  type SelectOption,
  type TreeSelectOption,
} from 'naive-ui'
import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import type { FieldApi, FormField, SelectField } from '../types/fields'
import { mapFieldDependencies, preformatFieldDependencies } from '../utils/dependencies'
import { mapFieldProps } from '../utils/field'
import { useFormState } from './useFormState'
import { useFormFields } from './useFormFields'
import type { GenericObject } from '@/_shared/types/utils'

export function useFieldContext(
  field: ComputedRef<FormField>,
  fieldState: WritableComputedRef<unknown>,
  state: Ref<GenericObject>,
  parentKey: ComputedRef<string[]>,
) {
  const i18n = useTranslations()
  const fieldId = generateUUID()
  const fieldFullPath = computed(() => [
    ...(parentKey.value ?? []),
    field.value.key,
  ])

  const { getFieldApi } = useFormState()
  const fieldApi: FieldApi = getFieldApi(field.value.key, parentKey.value)

  const dependencies = computed(() =>
    mapFieldDependencies(
      preformatFieldDependencies(
        field.value?.dependencies ?? [],
        state.value,
        parentKey.value,
      ),
    ),
  )

  const required = computed(() =>
    typeof field.value.required === 'function'
      ? field.value.required(dependencies.value, {
        getValue: fieldApi.getValue,
        getOptions: fieldApi.getOptions,
      })
      : !!field.value.required,
  )

  const inputProps = computed<GenericObject>(() =>
    mapFieldProps({
      field: field.value,
      fieldProps: field.value?.fieldParams ?? {},
      dependencies: dependencies.value,
      fieldApi: {
        getValue: fieldApi.getValue,
        getOptions: fieldApi.getOptions,
      },
      raw: false,
    }),
  )

  const rawInputProps = computed<GenericObject>(() =>
    mapFieldProps({
      field: field.value,
      fieldProps: field.value?.fieldParams ?? {},
      dependencies: dependencies.value,
      fieldApi: {
        getValue: fieldApi.getValue,
        getOptions: fieldApi.getOptions,
      },
      raw: true,
    }),
  )

  const _evalCondition = ref<boolean>(false)
  const conditionEffect = computed(
    () => field.value?.conditionEffect ?? 'hide',
  )
  const condition = computedAsync<boolean>(
    () =>
      field.value?.condition?.(dependencies.value, {
        getValue: fieldApi.getValue,
        getOptions: fieldApi.getOptions,
      }) ?? true,
    false,
    _evalCondition,
  )

  const disabled = computed(
    () =>
      (conditionEffect.value === 'disable' && !condition.value)
      || _evalOptions.value,
  )

  const { invalidateFieldOptions, subscribeOptionsInvalidation }
    = useFormFields()

  const removeSubscription = subscribeOptionsInvalidation(
    path =>
      [...(parentKey.value ?? []), field.value.key].join('.') === path
      && resolveOptions(),
  )
  onScopeDispose(() => removeSubscription())

  async function createOption() {
    const _field = field.value as SelectField
    if (!_field.createOption)
      return

    _evalOptions.value = true
    const selectOnCreation
      = typeof _field.createOption === 'function'
        ? true
        : _field.createOption?.selectOnCreation ?? true
    const handler
      = typeof _field.createOption === 'function'
        ? _field.createOption
        : _field.createOption?.handler

    const option = await handler(dependencies.value, {
      getValue: fieldApi.getValue,
      getOptions: fieldApi.getOptions,
    })
    if (!option) {
      _evalOptions.value = false
      return
    }

    _options.value = mapOptions([..._options.value, option])
    if (selectOnCreation) {
      nextTick(() => {
        const newVal = _options.value.at(-1)?.value
        if (_field.multiple)
          fieldState.value = [...(fieldState.value as Array<any>), newVal]
        else fieldState.value = newVal
      })
    }
    _evalOptions.value = false
    const revalidatePaths
      = typeof _field.createOption === 'object'
        ? _field.createOption.revalidateFieldOptions ?? []
        : []

    const mappedPaths = revalidatePaths.map(path =>
      path.startsWith('$parent')
        ? mapRelativeKeyPath([...(parentKey.value ?? [])], path)
        : mapRelativeKeyPath(path),
    )

    for (const path of mappedPaths) invalidateFieldOptions(path.join('.'))
  }

  async function resolveOptions() {
    if (!('options' in field.value))
      return []
    _evalOptions.value = true
    const _field = field.value as SelectField
    if (!_field.options) { return [] }
    else if (Array.isArray(_field.options)) { _options.value = mapOptions(_field.options) }
    else {
      _options.value = mapOptions(
        Array.isArray((field.value as SelectField).options)
          ? ((field.value as SelectField).options as unknown as (
            | SelectOption
            | TreeSelectOption
            | CascaderOption
            )[])
          : typeof (field.value as SelectField).options === 'function'
            ? await (
              (field.value as SelectField).options as (...args: any[]) => any
            )(
              { ...dependencies.value },
              {
                getValue: fieldApi.getValue,
                getOptions: fieldApi.getOptions,
              },
            )
            : [],
      )
    }
    _evalOptions.value = false
  }

  const _evalOptions = ref<boolean>(false)
  const _options = ref<(CascaderOption | SelectOption | TreeSelectOption)[]>(
    [],
  )
  watch(
    () => JSON.stringify(dependencies.value),
    async () => resolveOptions(),
    { immediate: true },
  )

  function selectActionFactory(_field: SelectField) {
    const createOptionsEnabled = typeof _field.createOption !== 'undefined'
    const allowOptionsRefresh = _field?.allowOptionsRefresh ?? false
    const createOptionLabel
      = typeof _field.createOption === 'function'
        ? undefined
        : _field.createOption?.label ?? undefined
    return {
      render: () => (
        <div
          class={`p-1 grid gap-2 ${
            createOptionsEnabled && allowOptionsRefresh
              ? 'grid-cols-2'
              : 'grid-cols-1'
          }`}
        >
          {typeof _field.createOption !== 'undefined' && (
            <NButton
              class="!w-full"
              quaternary={true}
              onClick={() => createOption()}
            >
              {{
                icon: () => <span class="iconify" data-icon="mdi:plus" />,
                default: () => (
                  <span class="uppercase">
                    {createOptionLabel
                    ?? i18n.t('form.fields.select.createOptionButton')}
                  </span>
                ),
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
                default: () => (
                  <span class="uppercase">
                    {i18n.t('form.fields.select.refreshOptionsButton')}
                  </span>
                ),
              }}
            </NButton>
          )}
        </div>
      ),
    }
  }

  const options = computed(() => {
    return [
      ..._options.value,
      ...(('createOption' in field.value
      && typeof field.value.createOption !== 'undefined')
      || ('allowRefreshOptions' in field.value && field.value.allowRefreshOptions)
        ? [selectActionFactory(field.value as SelectField)]
        : []),
    ]
  })

  if ('options' in field.value) {
    watch(
      () => _options.value,
      (fieldOptions: SelectOption[]) => {
        if (_evalOptions.value)
          return
        try {
          const optionValues = fieldOptions.map(option => option.value) ?? []
          if (Array.isArray(fieldState.value)) {
            setObjectProperty({
              key: field.value.key,
              object: state.value,
              scoped: true,
              parentKey: parentKey.value,
              value: fieldState.value.filter((item: any) =>
                optionValues.includes(item),
              ),
            })
          }
          else if (!optionValues.includes(fieldState.value as string | number)) {
            setObjectProperty({
              key: field.value.key,
              object: state.value,
              scoped: true,
              parentKey: parentKey.value,
              value: null,
            })
          }
        }
        catch (err) {
          console.error(err)
        }
      },
      {
        immediate: true,
        deep: true,
      },
    )
  }

  if (typeof field.value?.watch === 'function') {
    watch(
      () => getObjectProperty({ key: field.value.key, object: state.value, scoped: false }),
      (value: unknown) =>
        (field.value.watch as NonNullable<FormField['watch']>)(value, {
          getValue: fieldApi.getValue,
          setValue: fieldApi.setValue,
          getOptions: fieldApi.getOptions,
        }),
      field.value?.watchOptions ?? {},
    )
  }

  if (typeof field.value.onDependencyChange === 'function') {
    watch(
      () => JSON.stringify(dependencies.value),
      () =>
        field.value.onDependencyChange?.(dependencies.value, {
          getValue: fieldApi.getValue,
          setValue: fieldApi.setValue,
          getOptions: fieldApi.getOptions,
        }),
      { immediate: false },
    )
  }

  const placeholder = computed(() =>
    typeof field.value.placeholder === 'function'
      ? field.value.placeholder()
      : field.value?.placeholder
      ?? i18n.t('form.fields.text.defaultPlaceholder'),
  )

  return {
    _evalCondition,
    _evalOptions,
    _options,
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
    disabled,
    parentKey,
    fieldApi,
  }
}

function mapOptions(
  options: unknown[],
): (SelectOption | TreeSelectOption | CascaderOption)[] {
  if (!Array.isArray(options))
    return []
  return options.map(option =>
    ['number', 'string'].includes(typeof option)
      ? {
          label: option,
          value: option,
        }
      : option,
  ) as (SelectOption | TreeSelectOption | CascaderOption)[]
}
