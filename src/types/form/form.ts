/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllowedComponentProps, Component, VNodeChild, VNodeProps } from "vue";
import {
  ExpandRecursively,
  Narrowable,
  RemoveNeverProps,
  UnionToIntersection,
} from "./../utils";
import { ArrayVariantField, FormField, _FieldOptions } from "./fields";
import { F } from "ts-toolbelt";

export type FormSharedStore<K extends string = string> = Array<{
  key: K;
  dependencies?: (string | [string, string])[];
  value: (dependencies: Record<string, unknown>) => unknown | Promise<unknown>;
}>;

interface BaseFormSchema {
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
  overlayOpacity?: number;
  requiredMessage?: string | ((label: string) => string);
  testId?: string;
}

export interface FormStep<
  StepKey extends Narrowable = string,
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> {
  title?: string;
  icon?: string;
  root?: StepKey;
  fields: FormField<FieldKey, StoreData>[];
}

export type SimpleFormSchema<
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> = BaseFormSchema & {
  fields: FormField<FieldKey, StoreData>[];
};

export type SteppedFormSchema<
  StepKey extends Narrowable = "",
  FieldKey extends Narrowable = "",
  StoreData extends Record<string, unknown> = Record<string, unknown>
> = BaseFormSchema & {
  showPreviousButton?: boolean;
  previousButtonText?: string;
  nextButtonText?: string;
  steps: FormStep<StepKey, FieldKey, StoreData>[];
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
  : K extends { component: Component }
  ? ExtractCustomComponentType<K["component"]>
  : K extends { options: _FieldOptions }
  ? K extends { multiple: true } | { type: "checkbox-group" }
    ? ExtractOptionsType<K["options"]>[]
    : ExtractOptionsType<K["options"]>
  : K["type"] extends "checkbox"
  ? P extends { uncheckedValue: unknown; checkedValue: unknown }
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
  : K extends { type: "array-variant" }
  ? Array<ExtractVariantType<K["variants"], K["variantKey"]>>
  : K["type"] extends "daterange"
  ? [string, string]
  : K["type"] extends "number" | "slider"
  ? number
  : string;

export type ExtractVariantType<
  Variants extends ArrayVariantField<any, any>["variants"],
  VKey extends string
> = {
  [K in Variants[number] as K["key"]]: {
    [F in K["fields"][number] as F["key"]]: ResolveFormType<F>;
  } & { [key in VKey]: K["key"] };
}[Variants[number]["key"]];

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

type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<
      InstanceType<C>["$props"],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never;

export type ExtractCustomComponentType<
  T extends Component,
  Props = ComponentProps<T>
> = Props extends { modelValue: any } ? Props["modelValue"] : unknown;

export type FormInfoReturnType<T extends FormField<any, any>> =
  RemoveNeverProps<
    UnionToIntersection<
      | {
          [K in T as K extends {
            condition: (...args: any) => any;
            conditionEffect?: "hide" | undefined;
          }
            ? never
            : K["key"]]: K["ignore"] extends true ? never : ResolveFormType<K>;
        }
      | {
          [K in T as K extends {
            condition: (...args: any) => any;
            conditionEffect?: "hide" | undefined;
          }
            ? K["key"]
            : never]?: K["ignore"] extends true ? never : ResolveFormType<K>;
        }
    >
  >;

export type FormSchema<
  StepKey extends Narrowable = string,
  FieldKey extends Narrowable = string,
  StoreData extends Record<string, unknown> = Record<string, unknown>
> =
  | SimpleFormSchema<FieldKey, StoreData>
  | SteppedFormSchema<StepKey, FieldKey, StoreData>;

export type ExtractFieldsFromSteps<
  StepKey extends Narrowable,
  FieldKey extends Narrowable,
  TStep extends FormStep<StepKey, FieldKey, any>
> = ExtractSharedRoot<
  RemoveNeverProps<
    UnionToIntersection<
      | {
          [K in TStep as K["root"] extends string
            ? K["root"]
            : never]: ExpandRecursively<
            FormInfoReturnType<K["fields"][number]>
          >;
        }
      | {
          [K in TStep as K["root"] extends string
            ? never
            : "___$$sharedRoot___"]: K["root"] extends string
            ? never
            : ExpandRecursively<FormInfoReturnType<K["fields"][number]>>;
        }
    >
  >
>;

type ExtractSharedRoot<T> = T extends { ___$$sharedRoot___: infer R }
  ? R & Omit<T, "___$$sharedRoot___">
  : T;

export type FormInferredData<
  StoreData extends Record<string, unknown>,
  TFormSchema extends FormSchema<StepKey, FieldKey, StoreData>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable
> = TFormSchema extends SimpleFormSchema<FieldKey, StoreData>
  ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>
  : TFormSchema extends SteppedFormSchema<StepKey, FieldKey, StoreData>
  ? ExpandRecursively<
      ExtractFieldsFromSteps<StepKey, FieldKey, TFormSchema["steps"][number]>
    >
  : never;

export type InferSharedStoreData<
  Store extends FormSharedStore<string> | undefined
> = Store extends Array<unknown>
  ? {
      [K in Store[number] as K["key"]]: Awaited<ReturnType<K["value"]>>;
    }
  : Record<string, unknown>;
