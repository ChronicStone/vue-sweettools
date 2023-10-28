/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComputedRef } from "vue";
import { FormField } from "./fields";
import { FormInferredData, FormSchema, FormStep } from "./form";
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
    TFormSchema extends FormSchema<StepKey, FieldKey>,
    StepKey extends Narrowable,
    FieldKey extends Narrowable
  >(
    schema: TFormSchema,
    inputData?: Record<string, unknown>
  ): Promise<{
    isCompleted: boolean;
    formData: FormInferredData<TFormSchema, StepKey, FieldKey>;
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
  $reset(clear?: boolean): void;
  $validate(): Promise<boolean>;
  $v: ComputedRef<Validation<GenericObject, GenericObject>>;
  $data: ComputedRef<{ [key: string]: any }>;
  nextStep?: () => Promise<boolean>;
  previousStep?: () => void;
  currentStep?: ComputedRef<number>;
  canTriggerNext?: ComputedRef<boolean>;
  canTriggerPrevious?: ComputedRef<boolean>;
};
