import useVuelidate from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import type { ComputedRef, Ref } from 'vue'
import type { FieldApi, GroupField, ObjectField } from '../types/fields'
import type { FieldInstance } from '../types/instance'
import { resolveFieldDependencies } from '../utils/dependencies'
import { useLocalizedValidators } from './useLocalizedValidators'
import type { GenericObject } from '@/_shared/types/utils'

const [useProvideFormValidation, _useFormValidation] = createInjectionState(
  (
    formFields: ComputedRef<Array<FieldInstance>>,
    formState: Ref<GenericObject>,
    getFieldApi: (key: string, parentKey: string[]) => FieldApi,
  ) => {
    const formRules = ref<GenericObject>({})
    const $validator = useVuelidate(formRules, formState)

    const { i18n, required } = useLocalizedValidators()

    watch(
      [() => formState.value, () => formFields.value],
      async ([state, fields]) => {
        formRules.value = await mapFormFules(fields, state)
      },
      { immediate: true, deep: true },
    )

    async function mapFormFules(
      fields: typeof formFields.value,
      state: GenericObject,
      parentKey: string[] = [],
    ) {
      const rules: GenericObject = {}
      for (const field of fields) {
        if (field.type === 'info')
          continue
        const fieldValue = getObjectProperty({
          key: field.key,
          object: state,
          scoped: true,
          parentKey,
        })
        const dependencies = resolveFieldDependencies(field, state, parentKey)
        const { getValue, getOptions } = getFieldApi(field.key, parentKey)

        const condition
          = (await field?.condition?.(dependencies, { getValue, getOptions }))
          ?? true
        if (!condition && (field?.conditionEffect ?? 'hide') === 'hide')
          continue

        let fieldRules: GenericObject = {
          ...(rules?.[field.key] ?? {}),
        }

        const isRequired
          = typeof field.required === 'function'
            ? field.required(dependencies, { getValue, getOptions })
            : field?.required ?? false

        if (isRequired) {
          fieldRules.required = helpers.withMessage(
            params =>
              i18n.t('form.validators.required', {
                ...params,
                property:
                  typeof field.label === 'function'
                    ? field
                      .label?.(dependencies)
                      ?.toString()
                      .toLocaleLowerCase()
                    : field?.label?.toLocaleLowerCase() ?? field.key,
              }),
            field.type !== 'checkbox' ? required : value => !!value,
          )
        }

        if (field.type === 'object' || field.type === 'group') {
          const newRules = await mapFormFules(
            (field as ObjectField | GroupField).fields,
            state,
            [...parentKey, field.key],
          )
          fieldRules = {
            ...fieldRules,
            ...newRules,
          }
        }

        if (field.type === 'array-list' || field.type === 'array-tabs') {
          const arrayItemsRules = await Promise.all(
            (fieldValue as GenericObject[]).map((_, index) => mapFormFules(field.fields, state, [
              ...parentKey,
              field.key,
              index.toString(),
            ]),
            ),
          )

          fieldRules = {
            ...fieldRules,
            ...arrayToObject(arrayItemsRules),
          }
        }

        if (field.type === 'array-variant') {
          const arrayItemsRules = await Promise.all(
            (fieldValue as GenericObject[]).map((itemValue, index) => {
              const fields
                = field.variants.find(
                  variant => variant.key === itemValue[field.variantKey],
                )?.fields ?? []

              return mapFormFules(fields, state, [
                ...parentKey,
                field.key,
                index.toString(),
              ])
            }),
          )

          fieldRules = {
            ...fieldRules,
            ...arrayToObject(arrayItemsRules),
          }
        }

        if (typeof field?.validators === 'function') {
          fieldRules = {
            ...fieldRules,
            ...field.validators(dependencies, { getValue, getOptions }),
          }
        }
        if (typeof field?.validators === 'object')
          fieldRules = { ...fieldRules, ...field.validators }

        if (
          typeof field._stepRoot === 'string'
            && field._stepRoot
          && !parentKey.length
        ) {
          if (
            !rules[field._stepRoot]
            || typeof rules[field._stepRoot] !== 'object'
          )
            rules[field._stepRoot] = {};
          (rules[field._stepRoot] as GenericObject)[field.key] = fieldRules
        }
        else { rules[field.key] = fieldRules }
      }

      return rules
    }

    return { $validator }
  },
)

function useFormValidation() {
  const validationApi = _useFormValidation()
  if (!validationApi)
    throw new Error('No parent validation API on current scope')

  return validationApi
}

export { useProvideFormValidation, useFormValidation }
