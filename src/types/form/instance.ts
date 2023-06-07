/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComputedRef } from "vue";
import { FormField } from "./fields";
import {
  FormInferredData,
  FormSchema,
  FormSharedStore,
  FormStep,
  InferSharedStoreData,
} from "./form";
import { GenericObject, Narrowable } from "../utils";
import type { Validation } from "@vuelidate/core";

export type FormInstance = {
  _id: string;
  _resolve: (isCompleted: boolean, formData: Record<string, unknown>) => void;
  formSchema: any;
  formData: Record<string, unknown>;
};

export interface FormApi {
  formInstances: ComputedRef<FormInstance[]>;
  destroyAll: () => void;
  createForm<
    TFormSchema extends FormSchema<StepKey, FieldKey, StoreData>,
    StepKey extends Narrowable,
    FieldKey extends Narrowable,
    StoreKey extends string,
    Store extends FormSharedStore<StoreKey>,
    StoreData extends Record<string, unknown> = InferSharedStoreData<Store>
  >(
    schema: TFormSchema & { sharedStore?: Store },
    inputData?: Record<string, unknown>
  ): Promise<{
    isCompleted: boolean;
    formData: FormInferredData<StoreData, TFormSchema, StepKey, FieldKey>;
  }>;
}

export enum StepStatus {
  IN_PROGRESS,
  PENDING,
  COMPLETED,
  INVALID,
}
export interface StepInstance extends Omit<FormStep<string, string>, "fields"> {
  _status: StepStatus;
  _index: number;
}

export type FieldInstance = FormField & {
  _stepRoot?: string;
  _stepIndex?: number;
};

export type FormRefInstance = {
  $reset(): void;
  $validate(): Promise<boolean>;
  $v: ComputedRef<Validation<GenericObject, GenericObject>>;
  $data: ComputedRef<{ [key: string]: any }>;
  nextStep?: () => Promise<boolean>;
  previousStep?: () => void;
  currentStep?: ComputedRef<number>;
  canTriggerNext?: ComputedRef<boolean>;
  canTriggerPrevious?: ComputedRef<boolean>;
};
