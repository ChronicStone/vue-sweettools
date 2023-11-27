import { deepmerge } from 'deepmerge-ts'
import { getObjectProperty } from '../utils/object'
import type { LocaleDateFormatTemplate, SweettoolsLocaleTemplate } from '../types/i18n'
import { en } from '../i18n/en'
import { FORMAT_MAP } from '@/_shared/config/defaults'
import type { SweettoolsPluginConfig } from '@/_shared/types/lib'
import { PLUGIN_CONF_INJECTION_KEY } from '@/_shared/config/injectionKeys'
import type { DeepRequired, NestedPaths, TypeFromPath } from '@/_shared/types/utils'
import type { FormSchema } from '@/form/types/form'

const DEFAULT_FORM_CONFIG = {
  textOverrides: {
    requiredMessage: (label: string | (() => string)) =>
      `The field ${
        typeof label === 'function'
          ? label()?.toLocaleLowerCase()
          : label.toLocaleLowerCase()
      } is required`,
    nextBtnMessage: 'NEXT',
    prevBtnMessage: 'BACK',
    submitBtnMessage: 'SUBMIT',
    cancelBtnMessage: 'CANCEL',
  },
  uiConfig: {
    showStepper: true,
    showCloseButton: true,
    showCancelButton: false,
    showPrevButton: true,
    allowOutsideClick: true,
    overlayOpacity: 0.4,
  },
} as const

export function useGlobalConfig(formSchema?: FormSchema) {
  const config = inject(PLUGIN_CONF_INJECTION_KEY, {
    form: DEFAULT_FORM_CONFIG,
  })

  const permissionValidator = computed<
  (keys: Array<string | string[]>) => boolean
    >(() => config?.permissionValidator ?? (() => true),
    )

  const formConfig = computed(() => ({
    textOverrides: {
      requiredMessage:
        formSchema?.requiredMessage
        ?? config?.form?.textOverrides?.requiredMessage
        ?? DEFAULT_FORM_CONFIG.textOverrides.requiredMessage,
      nextBtnMessage:
        formSchema?.nextButtonText
        ?? config?.form?.textOverrides?.nextBtnMessage
        ?? DEFAULT_FORM_CONFIG.textOverrides.nextBtnMessage,
      prevBtnMessage:
        formSchema?.prevButtonText
        ?? config?.form?.textOverrides?.prevBtnMessage
        ?? DEFAULT_FORM_CONFIG.textOverrides.prevBtnMessage,
      submitBtnMessage:
        formSchema?.submitButtonText
        ?? config?.form?.textOverrides?.submitBtnMessage
        ?? DEFAULT_FORM_CONFIG.textOverrides.submitBtnMessage,
      cancelBtnMessage:
        formSchema?.cancelButtonText
        ?? config?.form?.textOverrides?.cancelBtnMessage
        ?? DEFAULT_FORM_CONFIG.textOverrides.cancelBtnMessage,
    },
    uiConfig: {
      showStepper:
        formSchema?.showStepper
        ?? config?.form?.uiConfig?.showStepper
        ?? DEFAULT_FORM_CONFIG.uiConfig.showStepper,
      showCloseButton:
        formSchema?.showCloseButton
        ?? config?.form?.uiConfig?.showCloseButton
        ?? DEFAULT_FORM_CONFIG.uiConfig.showCloseButton,
      showCancelButton:
        formSchema?.showCancelButton
        ?? config?.form?.uiConfig?.showCancelButton
        ?? DEFAULT_FORM_CONFIG.uiConfig.showCancelButton,
      showPrevButton:
        formSchema?.showPrevButton
        ?? config?.form?.uiConfig?.showPrevButton
        ?? DEFAULT_FORM_CONFIG.uiConfig.showPrevButton,
      allowOutsideClick:
        formSchema?.allowOutsideClick
        ?? config?.form?.uiConfig?.allowOutsideClick
        ?? DEFAULT_FORM_CONFIG.uiConfig.allowOutsideClick,
      overlayOpacity:
        formSchema?.overlayOpacity
        ?? config?.form?.uiConfig?.overlayOpacity
        ?? DEFAULT_FORM_CONFIG.uiConfig.overlayOpacity,
    },
  }))

  function getProp<
    T extends NestedPaths<NonNullable<SweettoolsPluginConfig['form']>> & string,
  >(
    key: T,
  ): NonNullable<TypeFromPath<NonNullable<SweettoolsPluginConfig['form']>, T>> {
    return getObjectProperty({
      key,
      object: formConfig.value,
      scoped: false,
    })
  }

  return {
    formConfig,
    permissionValidator,
    getProp,
    i18n: {
      enable: config?.i18n?.enable ?? true,
      dateDisplayFormat: deepmerge(
        { en: FORMAT_MAP },
        config?.i18n?.dateDisplayFormat ?? {},
      ) as Record<string, LocaleDateFormatTemplate>,
      dateValueFormat: deepmerge(
        { en: FORMAT_MAP },
        config?.i18n?.dateValueFormat ?? {},
      ) as Record<string, LocaleDateFormatTemplate>,
      translations: deepmerge(
        { en },
        config?.i18n?.translations ?? {},
      ) as Record<string, DeepRequired<SweettoolsLocaleTemplate>>,
    },
  }
}
