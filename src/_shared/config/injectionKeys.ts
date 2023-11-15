import type { InjectionKey, Ref } from 'vue'
import type { FormApi } from '@/form/types/instance'
import type { SweettoolsPluginConfig } from '@/_shared/types/lib'
import type { useFormStyles } from '@/form/composables/useFormStyles'

export const PLUGIN_CONF_INJECTION_KEY: InjectionKey<SweettoolsPluginConfig>
  = Symbol('SweetformsPluginConfig')

export const DESCRIPT_POPUP_INJECTION_KEY: InjectionKey<any> = Symbol(
  'SweetformsDescriptionPopup',
)
export const FORM_INJECTION_KEY: InjectionKey<FormApi>
  = Symbol('SweetformsForm')

export const MODAL_OVERLAY_INJECTION_KEY: InjectionKey<{
  modalOverlayRef: Ref<HTMLElement | undefined>
  show(): void
  hide(): void
  toggle(): void
}> = Symbol('SweetformsModalOverlay')
export const BREAKPOINTS_INJECTION_KEY: InjectionKey<any> = Symbol(
  'SweetformsBreakpoints',
)

export const FORM_STYLES_INJECTION_KEY: InjectionKey<
  ReturnType<typeof useFormStyles>
> = Symbol('FormStyles')
