import type { FormSchema } from '../types/form'

const [useProvideFormSchema, _useFormSchema] = createInjectionState((schema: ComputedRef<FormSchema>) => {
  return schema
})

function useFormSchema() {
  const _schema = _useFormSchema()
  if (!_schema)
    throw new Error('Form schema is not provided')
  return _schema
}

export { useFormSchema, useProvideFormSchema }
