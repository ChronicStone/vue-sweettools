import { ComputedRef, Ref, WatchStopHandle } from "vue";
import { FormField } from "./fields";
import {
  ExpandRecursively,
  ExtractFieldsFromSteps,
  FormInfoReturnType,
  FormSchema,
  FormStep,
  Narrowable,
  SimpleFormSchema,
  SteppedFormSchema,
} from "./form";

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
    formData: TFormSchema extends SimpleFormSchema<FieldKey>
      ? ExpandRecursively<FormInfoReturnType<TFormSchema["fields"][number]>>
      : TFormSchema extends SteppedFormSchema<StepKey, FieldKey>
      ? ExpandRecursively<
          ExtractFieldsFromSteps<
            StepKey,
            FieldKey,
            TFormSchema["steps"][number]
          >
        >
      : never;
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
};
