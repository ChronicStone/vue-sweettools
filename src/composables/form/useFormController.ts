import { FormField } from "@/types/form/fields";
import {
  FormInferredData,
  FormSchema,
  FormSharedStore,
  InferSharedStoreData,
} from "@/types/form/form";
import { FormRefInstance } from "@/types/form/instance";
import { Narrowable } from "@/types/utils";
import { ComputedRef, Ref } from "vue";
import { O } from "ts-toolbelt";

export function useFormController<
  TFormSchema extends FormSchema<StepKey, FieldKey, StoreData>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable,
  StoreKey extends string,
  Store extends FormSharedStore<StoreKey>,
  StoreData extends Record<string, unknown> = InferSharedStoreData<Store>
>(
  formRef: Ref<FormRefInstance | undefined>,
  schema: TFormSchema & { sharedStore?: Store }
): {
  schema: TFormSchema;
  validate(): Promise<boolean> | (() => boolean);
  formData: ComputedRef<
    FormInferredData<StoreData, TFormSchema, StepKey, FieldKey>
  >;
  nextStep: () => Promise<boolean>;
  previousStep: () => void;
  currentStep: ComputedRef<number>;
  canTriggerNext: ComputedRef<boolean>;
  canTriggerPrevious: ComputedRef<boolean>;
} {
  return {
    schema,
    validate: async () => {
      return (await formRef.value?.$validate()) ?? false;
    },
    formData: computed(() => formRef.value?.$data ?? {}) as ComputedRef<
      FormInferredData<StoreData, TFormSchema, StepKey, FieldKey>
    >,
    nextStep: async () => {
      return (await formRef.value?.nextStep?.()) ?? false;
    },
    previousStep: () => formRef?.value?.previousStep?.(),
    currentStep: computed(() => formRef.value?.currentStep?.value ?? 0),
    canTriggerNext: computed(
      () => formRef.value?.canTriggerNext?.value ?? false
    ),
    canTriggerPrevious: computed(
      () => formRef.value?.canTriggerPrevious?.value ?? false
    ),
  };
}

export function buildFormSchema<
  TFormSchema extends FormSchema<StepKey, FieldKey, StoreData>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable,
  StoreKey extends string,
  Store extends FormSharedStore<StoreKey>,
  StoreData extends Record<string, unknown> = InferSharedStoreData<Store>
>(schema: TFormSchema & { sharedStore?: Store }) {
  return schema;
}

export function buildFormSchemaDist<
  TFormSchema extends FormSchema<StepKey, FieldKey, StoreData>,
  StepKey extends Narrowable,
  FieldKey extends Narrowable,
  StoreKey extends string,
  Store extends FormSharedStore<StoreKey>,
  StoreData extends Record<string, unknown> = InferSharedStoreData<Store>
>(schema: TFormSchema & { sharedStore?: Store }) {
  return schema;
}

export function buildFieldSchema<
  TField extends FormField<FieldKey>,
  FieldKey extends Narrowable
>(field: TField): TField {
  return field;
}
