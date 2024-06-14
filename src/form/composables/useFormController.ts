import type { ComputedRef, Ref } from 'vue'
import type { FormRefInstance } from '../types/instance'
import type { FormField } from '../types/fields'
import type {
  FormInferredData,
  FormSchema,
} from '../types/form'
import type { Narrowable } from '@/_shared/types/utils'

export function useFormController<
  const TFormSchema extends FormSchema<StepKey, FieldKey>,
  const StepKey extends Narrowable,
  const FieldKey extends Narrowable,
>(
  formRef: Ref<FormRefInstance | undefined>,
  schema: TFormSchema,
): {
    schema: TFormSchema
    validate(): Promise<boolean> | (() => boolean)
    formData: ComputedRef<FormInferredData<TFormSchema, StepKey, FieldKey>>
    nextStep: () => Promise<boolean>
    previousStep: () => void
    currentStep: ComputedRef<number>
    canTriggerNext: ComputedRef<boolean>
    canTriggerPrevious: ComputedRef<boolean>
    isDirty: ComputedRef<boolean>
    reset: (clear?: boolean) => void
  } {
  return {
    schema,
    validate: async () => {
      return (await formRef.value?.$validate()) ?? false
    },
    formData: computed(() => formRef.value?.$data ?? {}) as ComputedRef<
      FormInferredData<TFormSchema, StepKey, FieldKey>
    >,
    isDirty: computed(() => formRef.value?.$dirty?.value ?? false),
    nextStep: async () => {
      return (await formRef.value?.nextStep?.()) ?? false
    },
    previousStep: () => formRef?.value?.previousStep?.(),
    currentStep: computed(() => formRef.value?.currentStep?.value ?? 0),
    canTriggerNext: computed(
      () => formRef.value?.canTriggerNext?.value ?? false,
    ),
    canTriggerPrevious: computed(
      () => formRef.value?.canTriggerPrevious?.value ?? false,
    ),
    reset: (clear?: boolean) => formRef.value?.$reset?.(clear),
  }
}

export function buildFormSchema<
  const TFormSchema extends FormSchema<StepKey, FieldKey>,
  const StepKey extends Narrowable,
  const FieldKey extends Narrowable,
>(schema: TFormSchema) {
  return schema
}

export function buildFormSchemaDist<
  const TFormSchema extends FormSchema<StepKey, FieldKey>,
  const StepKey extends Narrowable,
  const FieldKey extends Narrowable,
>(schema: TFormSchema) {
  return schema
}

export function buildFieldSchema<
  TField extends FormField<FieldKey>,
  FieldKey extends Narrowable,
>(field: TField): TField {
  return field
}

export function buildMultiFieldSchema<
  TField extends FormField<FieldKey>[],
  FieldKey extends Narrowable,
>(fields: TField): TField {
  return fields
}
