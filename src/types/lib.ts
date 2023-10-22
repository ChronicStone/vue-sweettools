import { RouteLocationRaw } from "vue-router";
import type { LocaleTemplate } from "./i18n";
export type SweettoolsPluginConfig = {
  form?: {
    textOverrides: {
      requiredMessage?: string | ((label: string) => string);
      nextBtnMessage?: string;
      prevBtnMessage?: string;
      submitBtnMessage?: string;
      cancelBtnMessage?: string;
    };
    uiConfig: {
      showStepper?: boolean;
      showCloseButton?: boolean;
      showCancelButton?: boolean;
      showPrevButton?: boolean;
      allowOutsideClick?: boolean;
      overlayOpacity?: number;
    };
  };
  permissionValidator?: (keys: Array<string | string[]>) => boolean;
  i18n?: {
    enable: boolean;
    translations?: {
      [key: string]: LocaleTemplate;
    };
  };
};

export interface AppTypes {
  routeLocation: RouteLocationRaw;
  permissionKey: string;
}
