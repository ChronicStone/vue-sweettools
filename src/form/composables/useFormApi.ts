import { inject } from 'vue'
import { FORM_INJECTION_KEY } from '@/_shared/config/injectionKeys'

export function useFormApi() {
  const formApi = inject(FORM_INJECTION_KEY)
  if (!formApi)
    throw new Error('No form provider found on parent scope')
  return formApi
}
