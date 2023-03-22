import { ComputedRef } from "vue";
import { FormField } from "./fields";
import { FormInferredData, FormSchema, FormStep } from "./form";
import { Narrowable } from "../utils";

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
  $reset(): void;
  $validate(): Promise<boolean>;
  $data: ComputedRef<{ [key: string]: any }>;
  nextStep?: () => Promise<boolean>;
  previousStep?: () => void;
  currentStep?: ComputedRef<number>;
  canTriggerNext?: ComputedRef<boolean>;
  canTriggerPrevious?: ComputedRef<boolean>;
};
