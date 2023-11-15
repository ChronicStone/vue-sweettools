import type { ComputedRef } from 'vue'
import type { FormSchema, SimpleFormSchema, SteppedFormSchema } from '../types/form'
import type { FieldInstance, StepInstance } from '../types/instance'
import { StepStatus } from '../types/instance'

function deepRemoveIgnoredFields(fields: FieldInstance[]): FieldInstance[] {
  return fields
    .filter(field => !field.ignore)
    .map(field => ({
      ...field,
      ...(field.fields && { fields: deepRemoveIgnoredFields(field.fields) }),
    })) as FieldInstance[]
}

const [useProvideFormFields, _useFormFields] = createInjectionState(
  (formSchema: ComputedRef<FormSchema>) => {
    const formFields = computed<FieldInstance[]>(() =>
      deepRemoveIgnoredFields(
        (formSchema.value as SimpleFormSchema)?.fields
          ?? (formSchema.value as SteppedFormSchema).steps
            .map((step, _stepIndex) => step.fields.map(field => ({
              ...field,
              _stepIndex,
              ...(step.root ? { _stepRoot: step.root } : {}),
            })),
            )
            .flat(),
      ),
    )
    const formSteps = ref<StepInstance[]>(
      (formSchema.value as SteppedFormSchema).steps?.length
        ? (formSchema.value as SteppedFormSchema).steps.map(
            // eslint-disable-next-line unused-imports/no-unused-vars
            ({ fields, ...step }: any, stepIndex: number) => ({
              ...step,
              _status:
                stepIndex === 0 ? StepStatus.IN_PROGRESS : StepStatus.PENDING,
              _index: stepIndex,
            }),
          )
        : [],
    )
    const currentStep = ref<number>(0)
    const isMultiStep = computed(() => formSteps.value?.length > 1)
    const filteredFormFields = computed(() =>
      !isMultiStep.value
        ? formFields.value
        : formFields.value.filter(
          field => field._stepIndex === currentStep.value,
        ),
    )

    const {
      dispatch: invalidateFieldOptions,
      subscribe: subscribeOptionsInvalidation,
    } = useEventDispatcher<(keyPath: string) => void>()

    return {
      formFields,
      filteredFormFields,
      isMultiStep,
      currentStep,
      formSteps,
      invalidateFieldOptions,
      subscribeOptionsInvalidation,
    }
  },
)

function useFormFields() {
  const fieldsApi = _useFormFields()
  if (!fieldsApi)
    throw new Error('Missing parent fields provier')

  return fieldsApi
}

export { useProvideFormFields, useFormFields }
