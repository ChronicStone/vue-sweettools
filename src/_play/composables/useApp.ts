import { useFormApi } from '@/index'

let formApi: ReturnType<typeof useFormApi> | null = null

export function useApp() {
  if (!formApi)
    formApi = useFormApi()

  return {
    formApi,
  }
}
