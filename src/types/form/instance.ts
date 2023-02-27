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
import { SelectOption } from "naive-ui";
import { GenericObject } from "../utils";

export interface FormInstance {
  _id: string;
  _resolve?: (data: {
    isCompleted: boolean;
    formData: { [key: string]: any };
  }) => void;
  formSchema: FormSchema<any, any>;
  formData: { [key: string]: any };
}

export interface FormApi {
  formInstances: ComputedRef<FormInstance[]>;
  createForm<
    TFormSchema extends FormSchema<StepKey, FieldKey>,
    StepKey extends Narrowable,
    FieldKey extends Narrowable
  >(
    schema: TFormSchema
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
};
