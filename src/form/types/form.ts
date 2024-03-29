import type { AllowedComponentProps, Component, VNodeChild, VNodeProps } from 'vue'
import type { UploadFileInfo } from 'naive-ui'
import type {
  ArrayVariantField,
  FormField,
  _BaseField,
  _FieldOptions,
} from './fields'
import type {
  ExpandRecursively,
  Narrowable,
  RemoveNeverProps,
  UnionToIntersection,
} from '@/_shared/types/utils'

export type FormSharedStore<K extends string = string> = Array<{
  key: K
  dependencies?: (string | [string, string])[]
  value: (dependencies: Record<string, unknown>) => unknown | Promise<unknown>
}>

interface BaseFormSchema {
  title?: string | (() => VNodeChild)
  gridSize?: number | string
  fieldSize?: number | string
  fullScreen?: boolean | string
  maxWidth?: number | string
  maxHeight?: number | string
  showCancelButton?: boolean | string
  cancelButtonText?: string
  submitButtonText?: string
  showCloseButton?: boolean
  allowOutsideClick?: boolean
  showPrevButton?: boolean
  prevButtonText?: string
  nextButtonText?: string
  showStepper?: boolean
  overlayOpacity?: number
  requiredMessage?: string | ((label: string) => string)
  testId?: string
}

export interface FormStep<
  StepKey extends Narrowable = string,
  FieldKey extends Narrowable = string,
> {
  title?: string | (() => VNodeChild)
  icon?: string
  root?: StepKey
  fields: FormField<FieldKey>[]
}

export type SimpleFormSchema<FieldKey extends Narrowable = string> =
  BaseFormSchema & {
    fields: FormField<FieldKey>[]
  }

export type SteppedFormSchema<
  StepKey extends Narrowable = '',
  FieldKey extends Narrowable = '',
> = BaseFormSchema & {
  showPreviousButton?: boolean
  previousButtonText?: string
  nextButtonText?: string
  steps: FormStep<StepKey, FieldKey>[]
  showStepper?: boolean
  stepperLayout?: 'full' | 'compact' | string
}

type ExtractFieldParams<K extends FormField<any>> = K['fieldParams'] extends (
  ...args: any
) => any
  ? ReturnType<K['fieldParams']>
  : K['fieldParams']

type ResolveFormType<
  K extends FormField<any>,
  P = ExtractFieldParams<K>,
> = K['type'] extends 'info'
  ? never
  : K['transform'] extends (value: any) => any
    ? ReturnType<K['transform']>
    : K extends { component: Component }
      ? ExtractCustomComponentType<K['component'], K['required']>
      : K extends { options: _FieldOptions }
        ? K extends { multiple: true } | { type: 'checkbox-group' }
          ? ExtractOptionsType<K['options']>[]
          : ExtractOptionsType<K['options']>
        : K['type'] extends 'checkbox'
          ? P extends { uncheckedValue: unknown, checkedValue: unknown }
          ? P['checkedValue'] | P['uncheckedValue']
            : boolean
          : K['type'] extends 'object' | 'group'
            ? K['fields'] extends infer U extends FormField<any>[]
              ? FormInfoReturnType<U[number]>
              : never
            : K['type'] extends 'array-list' | 'array-tabs'
              ? K['fields'] extends infer U extends FormField<any>[]
                ? FormInfoReturnType<U[number]>[]
                : never
              : K['type'] extends 'upload'
                ? K extends { multiple: true }
                  ? K extends { output: 'object' } ? Array<UploadFileInfo> : Array<string>
                  : K extends { output: 'object' } ? UploadFileInfo : string
                :
                K extends { type: 'array-variant' }
                  ? Array<ExtractVariantType<K['variants'], K['variantKey']>>
                  : K['type'] extends 'daterange' | 'datetimerange' | 'monthrange'
                    ? [string, string]
                    : K['type'] extends 'number' | 'slider'
                      ? number
                      : string

export type ExtractVariantType<
  Variants extends ArrayVariantField<any>['variants'],
  VKey extends string,
> = {
  [K in Variants[number] as K['key']]: {
    [F in K['fields'][number] as F['key']]: ResolveFormType<F>;
  } & { [key in VKey]: K['key'] };
}[Variants[number]['key']]

export type ExtractOptionsType<
  T extends _FieldOptions,
  V = T extends Array<unknown>
    ? T[number]
    : T extends (...args: any) => Promise<Array<unknown>> | Array<unknown>
      ? Awaited<ReturnType<T>>[number]
      : string | number,
> = V extends { value: unknown }
  ? V['value']
  : V extends { key: unknown }
    ? V['key']
    : V

type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<
      InstanceType<C>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never

export type ExtractCustomComponentType<
  T extends Component,
  Required extends _BaseField['required'],
  Props = ComponentProps<T>,
> = Props extends { modelValue: any } | { modelValue?: any }
  ? Required extends true
    ? Exclude<Props['modelValue'], undefined | null>
    : Props['modelValue']
  : unknown

export type FormInfoReturnType<T extends FormField<any>> = RemoveNeverProps<
  UnionToIntersection<
    | {
      [K in T as K extends {
        condition: (...args: any) => any
        conditionEffect?: 'hide' | undefined
      }
        ? never
        : K['key']]: K['ignore'] extends true ? never : ResolveFormType<K>;
    }
    | {
      [K in T as K extends {
        condition: (...args: any) => any
        conditionEffect?: 'hide' | undefined
      }
        ? K['key']
        : never]?: K['ignore'] extends true ? never : ResolveFormType<K>;
    }
  >
>

export type FormSchema<
  StepKey extends Narrowable = string,
  FieldKey extends Narrowable = string,
> = SimpleFormSchema<FieldKey> | SteppedFormSchema<StepKey, FieldKey>

export type ExtractFieldsFromSteps<
  StepKey extends Narrowable,
  FieldKey extends Narrowable,
  TStep extends FormStep<StepKey, FieldKey>,
> = ExtractSharedRoot<
  RemoveNeverProps<
    UnionToIntersection<
      | {
        [K in TStep as K['root'] extends string
          ? K['root']
          : never]: ExpandRecursively<
            FormInfoReturnType<K['fields'][number]>
          >;
      }
      | {
        [K in TStep as K['root'] extends string
          ? never
          : '___$$sharedRoot___']: K['root'] extends string
          ? never
          : ExpandRecursively<FormInfoReturnType<K['fields'][number]>>;
      }
    >
  >
>

type ExtractSharedRoot<T> = T extends { ___$$sharedRoot___: infer R }
  ? R & Omit<T, '___$$sharedRoot___'>
  : T

export type FormInferredData<
  TFormSchema extends FormSchema<StepKey, FieldKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable,
> = TFormSchema extends SimpleFormSchema<FieldKey>
  ? ExpandRecursively<FormInfoReturnType<TFormSchema['fields'][number]>>
  : TFormSchema extends SteppedFormSchema<StepKey, FieldKey>
    ? ExpandRecursively<
      ExtractFieldsFromSteps<StepKey, FieldKey, TFormSchema['steps'][number]>
    >
    : never

export type InferSharedStoreData<
  Store extends FormSharedStore<string> | undefined,
> = Store extends Array<unknown>
  ? {
      [K in Store[number] as K['key']]: Awaited<ReturnType<K['value']>>;
    }
  : Record<string, unknown>
