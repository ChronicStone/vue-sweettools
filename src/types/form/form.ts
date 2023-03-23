import { VNodeChild } from "vue";
import {
  ExpandRecursively,
  Narrowable,
  Primitive,
  RemoveNeverProps,
  UnionToIntersection,
} from "./../utils";
import { FormField, SelectField, _FieldOptions } from "./fields";

interface FormSharedStore {
  dependencies?: (string | [string, string])[];
  value:
    | unknown
    | ((dependencies?: Record<string, unknown>) => unknown)
    | ((dependencies?: Record<string, unknown>) => Promise<unknown>);
}

interface BaseFormSchema<StoreKey extends string = string> {
  title?: string | (() => VNodeChild);
  gridSize?: number | string;
  fieldSize?: number | string;
  fullScreen?: boolean | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  showCancelButton?: boolean | string;
  cancelButtonText?: string;
  submitButtonText?: string;
  showCloseButton?: boolean;
  allowOutsideClick?: boolean;
  showPrevButton?: boolean;
  prevButtonText?: string;
  nextButtonText?: string;
  showStepper?: boolean;
  requiredMessage?: string | ((label: string | (() => string)) => string);
  sharedStore?: Record<StoreKey, FormSharedStore>;
}

export interface FormStep<
  StepKey extends Narrowable = string,
  FieldKey extends Narrowable = string,
  StoreKey extends string = string
> {
  title?: string;
  icon?: string;
  root?: StepKey;
  fields: FormField<FieldKey, StoreKey>[];
}

export type SimpleFormSchema<
  FieldKey extends Narrowable = string,
  StoreKey extends string = string
> = BaseFormSchema<StoreKey> & {
  fields: FormField<FieldKey, StoreKey>[];
};

export type SteppedFormSchema<
  StepKey extends Narrowable = "",
  FieldKey extends Narrowable = "",
  StoreKey extends string = string
> = BaseFormSchema<StoreKey> & {
  showPreviousButton?: boolean;
  previousButtonText?: string;
  nextButtonText?: string;
  steps: FormStep<StepKey, FieldKey, StoreKey>[];
  showStepper?: boolean;
  stepperLayout?: "full" | "compact" | string;
};

type ExtractFieldParams<K extends FormField<any>> = K["fieldParams"] extends (
  ...args: any
) => any
  ? ReturnType<K["fieldParams"]>
  : K["fieldParams"];

type ResolveFormType<
  K extends FormField<any>,
  P = ExtractFieldParams<K>
> = K["type"] extends "info"
  ? never
  : K["transform"] extends (value: any) => any
  ? ReturnType<K["transform"]>
  : K extends { options: _FieldOptions }
  ? K extends { multiple: true } | { type: "checkbox-group" }
    ? ExtractOptionsType<K["options"]>[]
    : ExtractOptionsType<K["options"]>
  : K["type"] extends "checkbox"
  ? P extends { uncheckedValue: any; checkedValue: any }
    ? P["checkedValue"] | P["uncheckedValue"]
    : boolean
  : K["type"] extends "object" | "group"
  ? K["fields"] extends infer U extends FormField<any>[]
    ? FormInfoReturnType<U[number]>
    : never
  : K["type"] extends "array-list" | "array-tabs"
  ? K["fields"] extends infer U extends FormField<any>[]
    ? FormInfoReturnType<U[number]>[]
    : never
  : K["type"] extends "daterange"
  ? [string, string]
  : K["type"] extends "number" | "slider"
  ? number
  : string;

export type ExtractOptionsType<
  T extends _FieldOptions,
  V = T extends Array<unknown>
    ? T[number]
    : T extends (...args: any) => Promise<Array<unknown>> | Array<unknown>
    ? Awaited<ReturnType<T>>[number]
    : string | number
> = V extends { value: unknown }
  ? V["value"]
  : V extends { key: unknown }
  ? V["key"]
  : V;

export type FormInfoReturnType<T extends FormField<any>> = RemoveNeverProps<
  UnionToIntersection<
    | {
        [K in T as K["condition"] extends (...args: any) => any
          ? never
          : K["key"]]: K["ignore"] extends true ? never : ResolveFormType<K>;
      }
    | {
        [K in T as K["condition"] extends (...args: any) => any
          ? K["key"]
          : never]?: K["ignore"] extends true ? never : ResolveFormType<K>;
      }
  >
>;

export type FormSchema<
  StepKey extends Narrowable = string,
  FieldKey extends Narrowable = string,
  StoreKey extends string = string
> =
  | SimpleFormSchema<FieldKey, StoreKey>
  | SteppedFormSchema<StepKey, FieldKey, StoreKey>;

export type ExtractFieldsFromSteps<
  StepKey extends Narrowable,
  FieldKey extends Narrowable,
  TStep extends FormStep<StepKey, FieldKey>
> = TStep["root"] extends string
  ? {
      [key in TStep["root"]]: ExpandRecursively<
        FormInfoReturnType<TStep["fields"][number]>
      >;
    }
  : ExpandRecursively<FormInfoReturnType<TStep["fields"][number]>>;

export type FormInferredData<
  TFormSchema extends FormSchema<StepKey, FieldKey>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable
> = TFormSchema extends SimpleFormSchema<FieldKey>
  ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>
  : TFormSchema extends SteppedFormSchema<StepKey, FieldKey>
  ? ExpandRecursively<
      ExtractFieldsFromSteps<StepKey, FieldKey, TFormSchema["steps"][number]>
    >
  : never;
