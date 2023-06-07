import { MaybeComputedRef, MaybeRef } from "@vueuse/core";
import { GlobalThemeOverrides } from "naive-ui";

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
};
