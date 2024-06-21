import type { FieldApi, FormField, _ArrayField } from '../types/fields'
import { resolveFieldDependencies } from './dependencies'
import type { GenericObject } from '@/_shared/types/utils'

export function isArrayField(field: FormField): field is FormField & { type: 'array-list' | 'array-tabs' | 'array-variant' } {
  return field.type === 'array-list' || field.type === 'array-tabs' || field.type === 'array-variant'
}

export function isObjectField(field: FormField): field is FormField & { type: 'object' | 'group' } {
  return field.type === 'object' || field.type === 'group'
}

export function preformatFormState(
  fields: Array<FormField & { _stepRoot?: string }>,
  inputState: GenericObject,
  parentKeys: string[],
) {
  const state: GenericObject = {}
  for (const field of fields) {
    if (field.type === 'info')
      continue

    const fieldValue = getObjectProperty({
      key: [...(field._stepRoot ? [field._stepRoot] : []), field.key].join('.'),
      object: inputState,
      scoped: false,
    })

    let fieldOutput: any = getPreformatedField(fieldValue, fieldValue, field)

    if (isArrayField(field)) {
      fieldOutput = ((fieldOutput ?? []) as Array<GenericObject>).map(
        (itemValue, index) => preformatFormState(
          field.fields ?? [],
          itemValue,
          [
            ...parentKeys,
            field.key,
            ...(typeof index === 'number' ? [index.toString()] : []),
          ],
        ),
      )
    }

    if (isObjectField(field)) {
      fieldOutput = preformatFormState(
        field.fields ?? [],
        fieldOutput,
        [
          ...parentKeys,
          field.key,
        ],
      )
    }

    if (
      typeof field._stepRoot === 'string'
        && field._stepRoot
        && !parentKeys.length
    ) {
      if (!state[field._stepRoot] || typeof state[field._stepRoot] !== 'object')
        state[field._stepRoot] = {};
      (state[field._stepRoot] as GenericObject)[field.key] = fieldOutput
    }
    else { state[field.key] = fieldOutput }
  }

  return unwrapProxy(state)
}

export function mapFieldsInitialState(
  getFieldApi: (key: string, parentKey: string[]) => FieldApi,
  inputState: Record<string, unknown>,
  fields: Array<FormField & { _stepRoot?: string }> = [],
  parentKeys: string[] = [],
  rootState: Record<string, unknown> = inputState,
) {
  const state: GenericObject = {}
  for (const field of fields) {
    if (field.type === 'info')
      continue

    const fieldValue = getObjectProperty({
      key: [...(field._stepRoot ? [field._stepRoot] : []), ...parentKeys, field.key].join('.'),
      object: rootState,
      scoped: false,
    })

    let fieldOutput: unknown = fieldValue
    if (
      field.type === 'array-list'
        || field.type === 'array-tabs'
        || field.type === 'array-variant'
    ) {
      fieldOutput = ((fieldValue ?? []) as Array<Record<string, unknown>>).map(
        (itemValue, index) => {
          let fields: Array<FormField>
          let variantKey = ''
          if (field.type === 'array-variant') {
            variantKey = field.variantKey
            fields
                  = field.variants.find(v => v.key === itemValue[variantKey])
                ?.fields ?? []
          }
          else {
            fields = field.fields
          }
          return {
            ...('extraProperties' in field && field.extraProperties === true
              ? appendExtraProperties(
                fields,
                itemValue as Record<string, unknown>,
              )
              : {}),
            ...getNestedFieldOutput(
              getFieldApi,
              'input',
              inputState,
              rootState,
              field.type === 'array-variant'
                ? {
                    ...field,
                    type: 'array-tabs',
                    fields,
                  }
                : field,
              parentKeys,
              index,
            ),
            ...(variantKey ? { [variantKey]: itemValue[variantKey] } : {}),
          }
        },
      )
    }
    else if (field.type === 'object' || field.type === 'group') {
      fieldOutput = {
        ...('extraProperties' in field && field.extraProperties === true
          ? appendExtraProperties(field.fields, fieldValue)
          : {}),
        ...getNestedFieldOutput(
          getFieldApi,
          'input',
          inputState,
          rootState,
          field,
          parentKeys,
        ),
      }
    }

    if (field.type === 'object' || field.type === 'group')

      console.log('fieldOutput::post', fieldOutput)

    if (!fieldOutput)
      fieldOutput = getFallbackFieldValue(field)

    if (
      typeof field._stepRoot === 'string'
        && field._stepRoot
        && !parentKeys.length
    ) {
      if (!state[field._stepRoot] || typeof state[field._stepRoot] !== 'object')
        state[field._stepRoot] = {};
      (state[field._stepRoot] as GenericObject)[field.key] = fieldOutput
    }
    else { state[field.key] = fieldOutput }
  }

  return unwrapProxy(state)
}

export function mapFieldsOutputState(
  getFieldApi: (key: string, parentKey: string[]) => FieldApi,
  inputState: Record<string, unknown>,
  fields: Array<FormField & { _stepRoot?: string }> = [],
  parentKeys: string[] = [],
  rootState: Record<string, unknown> = inputState,
) {
  const state: Record<string, any> = {}
  for (const field of fields) {
    if (field.type === 'info')
      continue
    const fieldValue = getObjectProperty({
      key: [...(field._stepRoot ? [field._stepRoot] : []), ...parentKeys, field.key].join('.'),
      object: rootState,
      scoped: false,
    })
    const fieldDependencies = resolveFieldDependencies(
      field,
      rootState,
      parentKeys,
    )

    const fieldApi = getFieldApi(field.key, parentKeys)
    const includeField = !field.condition
      ? true
      : field.condition(fieldDependencies, fieldApi) || field?.conditionEffect !== 'hide'

    if (!includeField)
      continue
    let fieldOutput = fieldValue

    if (
      field.type === 'array-list'
      || field.type === 'array-tabs'
      || field.type === 'array-variant'
    ) {
      fieldOutput = ((fieldValue ?? []) as Array<Record<string, unknown>>).map(
        (itemValue, index) => {
          let fields: Array<FormField>
          let variantKey = ''
          if (field.type === 'array-variant') {
            variantKey = field.variantKey
            fields
                = field.variants.find(v => v.key === itemValue[variantKey])
                ?.fields ?? []
          }
          else {
            fields = field.fields
          }

          return {
            ...('extraProperties' in field && field.extraProperties === true
              ? appendExtraProperties(
                fields,
                itemValue as Record<string, unknown>,
              )
              : {}),
            ...getNestedFieldOutput(
              getFieldApi,
              'output',
              inputState,
              rootState,
              field.type === 'array-variant'
                ? {
                    ...field,
                    type: 'array-tabs',
                    fields,
                  }
                : field,
              parentKeys,
              index,
            ),
            ...(variantKey ? { [variantKey]: itemValue[variantKey] } : {}),
          }
        },
      )
    }
    else if (field.type === 'object' || field.type === 'group') {
      fieldOutput = {
        ...('extraProperties' in field && field.extraProperties === true
          ? appendExtraProperties(field.fields, fieldValue)
          : {}),
        ...getNestedFieldOutput(
          getFieldApi,
          'output',
          inputState,
          rootState,
          field,
          parentKeys,
        ),
      }
    }

    if (field._stepRoot && !parentKeys.length) {
      if (!state[field._stepRoot as string])
        state[field._stepRoot as string] = {}
      state[field._stepRoot as string][field.key] = getTransformedField(
        fieldOutput,
        field,
      )
    }
    else {
      state[field.key] = getTransformedField(fieldOutput, field)
    }
  }

  return unwrapProxy(state)
}

function getTransformedField(value: unknown, field: FormField) {
  return field.transform?.(value) ?? value
}

function getPreformatedField(
  value: unknown,
  rawValue: unknown,
  field: FormField,
) {
  return field?.preformat?.(value) ?? value
}

function unwrapProxy(data: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(data))
}

function getNestedFieldOutput(
  getFieldApi: (key: string, parentKey: string[]) => FieldApi,
  mode: 'input' | 'output',
  inputState: Record<string, unknown>,
  rootState: Record<string, unknown>,
  field: FormField & { _stepRoot?: string },
  parentKeys: string[],
  index?: number,
) {
  const hasRoot = field._stepRoot && !parentKeys.length
  const executor
      = mode === 'input' ? mapFieldsInitialState : mapFieldsOutputState

  const fieldValue = getObjectProperty({
    key: [...(hasRoot ? [field._stepRoot as string] : []), field.key, ...(typeof index === 'number' ? [index.toString()] : [])].join('.'),
    object: inputState,
    scoped: false,
  })

  return executor(
    getFieldApi,
    fieldValue,
    field.fields,
    [
      ...parentKeys,
      field.key,
      ...(typeof index === 'number' ? [index.toString()] : []),
    ],
    rootState,
  )
}

function getFallbackFieldValue(field: FormField) {
  if (field.default)
    return field.default
  switch (field.type) {
    case 'array-list':
    case 'array-tabs':
    case 'checkbox-group':
    case 'tag':
      return []
    case 'object':
      return {}
    case 'text':
    case 'textarea':
    case 'password':
      return ''
    case 'cascader':
    case 'select':
    case 'tree-select':
      return field?.multiple ? [] : null
    case 'checkbox':
    case 'switch':
      return false
    case 'rating':
    case 'number':
    case 'slider':
      return 0
    case 'radio':
    default:
      return null
  }
}
