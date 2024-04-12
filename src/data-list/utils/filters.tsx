import type { VNodeChild } from 'vue'
import { k } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'
import { NSelect } from 'naive-ui'
import type { ComparatorMatchMode, DynamicFilter, MatchModeCore, NonObjectMatchMode } from '../types/shared'
import type { CascaderField, CheckboxField, ColorPickerField, DateField, FormField, NumberField, PasswordField, RadioField, RatingField, SelectField, SliderField, SwitchField, TagField, TextAreaField, TextField, TimeField, TreeSelectField, _BaseField, _FieldOptions } from '@/form/types/fields'

export function textFilter({
  key,
  label,
  matchMode,
}: {
  label: string | (() => VNodeChild)
  key: string
  matchMode: 'equals' | 'contains'
}): DynamicFilter {
  return {
    key,
    matchMode,
    type: 'text',
    label,
  }
}

export function selectFilter({
  key,
  label,
  options,
  multiple,
}: {
  label: string | (() => VNodeChild)
  key: string
  options: _FieldOptions
  multiple?: boolean
}): DynamicFilter {
  return {
    label,
    key,
    options,
    type: 'select',
    matchMode: 'equals',
    ...(multiple ? { arrayLookup: 'OR' } : {}),
  }
}

export function booleanFilter({
  key,
  label,
  options,
}: {
  key: string
  label: string | (() => VNodeChild)
  options?: {
    truthyValue?: boolean | number | string
    falsyValue?: boolean | number | string
  }
}): DynamicFilter {
  return {
    key,
    label,
    type: 'radio',
    matchMode: 'equals',
    default: undefined,
    options: [
      { label: 'Yes', value: options?.truthyValue ?? true },
      { label: 'No', value: options?.falsyValue ?? false },
      { label: 'All', value: undefined },
    ],
  }
}

export function booleanExistFilter({
  key,
  label,
}: {
  key: string
  label: string | (() => VNodeChild)
}): DynamicFilter {
  return {
    ...booleanFilter({ key, label }),
    matchMode: 'exists',
  }
}

export function timeRangeFilter({
  key,
  label,
}: {
  key: string
  label: string | (() => VNodeChild)
}): DynamicFilter {
  return {
    key,
    label,
    type: 'daterange',
    matchMode: 'between',
    params: { dateMode: true },
  }
}

export type FilterBuilderProperty = {
  label: string | (() => VNodeChild)
  key: string
  matchModes?: NonObjectMatchMode[]
  field: Omit<_BaseField, 'key' | 'label'> & (
    | TextField
    | TextAreaField
    | PasswordField
    | SelectField
    | NumberField
    | ColorPickerField
    | SliderField
    | SwitchField
    | RadioField
    | CheckboxField
    | TimeField
    | DateField
    | TreeSelectField
    | CascaderField
    | RatingField
    | TagField
  )
}

type Params = {
  key: string
  lookupAtRoot?: boolean
  operator: 'AND' | 'OR'
  properties: Array<FilterBuilderProperty>
}

type RawFilterProperty = {
  propertyName: string
  matchMode: NonObjectMatchMode
  value: any
}

export function propertyBuilderFilter(params: Params): DynamicFilter {
  const operator = ref<'AND' | 'OR'>(params.operator)
  return {
    label: 'Property Builder',
    labelExtra: () => (
      <NSelect
        size="tiny"
        class="w-16"
        options={['AND', 'OR'].map(value => ({ label: value, value }))}
        value={operator.value}
        onUpdate:value={val => operator.value = val}
      />
    ),
    key: params.key,
    type: 'array-list',
    matchMode: 'objectMatch',
    lookupAtRoot: params.lookupAtRoot,
    arrayLookup: () => operator.value,
    params: (rawValue: Array<RawFilterProperty>) => {
      return {
        operator: 'AND',
        properties: rawValue.map(({ propertyName, matchMode }) => ({
          key: propertyName,
          matchMode,
        })),
        transformFilterValue: (rawValue: Array<RawFilterProperty>) => {
          return rawValue.map(({ value, propertyName }) => ({ [propertyName]: value }))
        },
      }
    },
    collapsible: false,
    gridSize: 1,
    fields: [
      {
        key: 'propertyName',
        label: 'Property',
        type: 'select',
        options: params.properties.map(p => ({ label: p.label, value: p.key })),
      },
      {
        key: 'matchMode',
        label: 'Match Mode',
        type: 'select',
        condition: deps => deps.propertyName,
        dependencies: [['$parent.propertyName', 'propertyName']],
        options: (deps) => {
          const matchModes = [
            { label: 'Equals', value: 'equals' },
            { label: 'Contains', value: 'contains' },
            { label: 'Between', value: 'between' },
            { label: 'Not Equals', value: 'notEquals' },
            { label: 'Greater Than', value: 'greaterThan' },
            { label: 'Greater Than or Equal', value: 'greaterThanOrEqual' },
            { label: 'Less Than', value: 'lessThan' },
            { label: 'Less Than or Equal', value: 'lessThanOrEqual' },
            { label: 'Exists', value: 'exists' },
            { label: 'Array Length', value: 'arrayLength' },
          ] satisfies Array<{ label: string; value: NonObjectMatchMode }>

          const property = params.properties.find(p => p.key === deps.propertyName)
          if (!property)
            return matchModes

          return matchModes.filter(m => property.matchModes?.includes(m.value) ?? true)
        },
      },
      ...params.properties.map(p => ({
        key: 'value',
        label: 'Value',
        ...p.field,
        dependencies: [['$parent.propertyName', 'propertyName', ['$parent.matchMode', 'matchMode']]],
        condition: (deps: any) => deps.propertyName === p.key && deps?.matchMode,
      }) as any),
    ],
  }
}
