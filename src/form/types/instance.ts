import type { ComputedRef } from 'vue'
import type { Validation } from '@vuelidate/core'
import type { FormField } from './fields'
import type { FormInferredData, FormSchema, FormStep } from './form'
import type { GenericObject, Narrowable } from '@/_shared/types/utils'

export type FormInstance = {
  _id: string
  _resolve: (isCompleted: boolean, formData: Record<string, unknown>) => void
  formSchema: any
  formData: Record<string, unknown>
}

export interface FormApi {
  formInstances: ComputedRef<FormInstance[]>
  destroyAll: () => void
  createForm<
   const TFormSchema extends FormSchema<StepKey, FieldKey>,
    const StepKey extends Narrowable,
    const FieldKey extends Narrowable,
  >(
    schema: TFormSchema,
    inputData?: Record<string, unknown>
  ): Promise<{
    isCompleted: boolean
    formData: FormInferredData<TFormSchema, StepKey, FieldKey>
  }>
}

export enum StepStatus {
  IN_PROGRESS,
  PENDING,
  COMPLETED,
  INVALID,
}
export interface StepInstance extends Omit<FormStep<string, string>, 'fields'> {
  _status: StepStatus
  _index: number
}

export type FieldInstance = FormField & {
  _stepRoot?: string
  _stepIndex?: number
}

export type FormRefInstance = {
  $reset(clear?: boolean): void
  $validate(): Promise<boolean>
  $v: ComputedRef<Validation<GenericObject, GenericObject>>
  $data: ComputedRef<{ [key: string]: any }>
  $dirty: ComputedRef<boolean>
  nextStep?: () => Promise<boolean>
  previousStep?: () => void
  currentStep?: ComputedRef<number>
  canTriggerNext?: ComputedRef<boolean>
  canTriggerPrevious?: ComputedRef<boolean>
}
