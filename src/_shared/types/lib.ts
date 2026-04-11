import type { RouteLocationRaw } from 'vue-router'
import type {
  LocaleDateFormatTemplate,
  SweettoolsLocaleTemplate,
} from './i18n'
import type { GenericObject } from './utils'
import type { FormSchema } from '@/form/types/form'

export type SweettoolsPluginConfig = {
  form?: {
    textOverrides: {
      requiredMessage?: string | ((label: string) => string)
      nextBtnMessage?: string
      prevBtnMessage?: string
      submitBtnMessage?: string
      cancelBtnMessage?: string
    }
    uiConfig: {
      showStepper?: boolean
      showCloseButton?: boolean
      showCancelButton?: boolean
      showPrevButton?: boolean
      allowOutsideClick?: boolean
      overlayOpacity?: number
    }
    onFormRender?: (schema: FormSchema, data?: GenericObject) => void
  }
  permissionValidator?: (keys: Array<string | string[]>) => boolean
  i18n?: {
    enable: boolean
    translations?: { [key: string]: SweettoolsLocaleTemplate }
    dateDisplayFormat?: { [key: string]: LocaleDateFormatTemplate }
    dateValueFormat?: { [key: string]: LocaleDateFormatTemplate }
  }
}

export interface AppTypes {
  routeLocation: RouteLocationRaw
  permissionKey: string
}
