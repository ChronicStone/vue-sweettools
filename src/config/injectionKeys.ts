import { FormApi } from "@/types/form/instance";
import { SweettoolsPluginConfig } from "@/types/lib";
import { InjectionKey, Ref } from "vue";

export const PLUGIN_CONF_INJECTION_KEY: InjectionKey<SweettoolsPluginConfig> =
  Symbol("SweetformsPluginConfig");

export const DESCRIPT_POPUP_INJECTION_KEY: InjectionKey<any> = Symbol(
  "SweetformsDescriptionPopup"
);
export const FORM_INJECTION_KEY: InjectionKey<FormApi> =
  Symbol("SweetformsForm");

export const MODAL_OVERLAY_INJECTION_KEY: InjectionKey<{
  modalOverlayRef: Ref<HTMLElement | undefined>;
  show(): void;
  hide(): void;
  toggle(): void;
}> = Symbol("SweetformsModalOverlay");
export const BREAKPOINTS_INJECTION_KEY: InjectionKey<any> = Symbol(
  "SweetformsBreakpoints"
);

export const FORM_STYLES_INJECTION_KEY: InjectionKey<
  ReturnType<typeof useFormStyles>
> = Symbol("FormStyles");
