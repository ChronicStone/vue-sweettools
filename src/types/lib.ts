import { MaybeComputedRef, MaybeRef } from "@vueuse/core";
import { GlobalThemeOverrides } from "naive-ui";

export type SweettoolsPluginConfig = {
  themeOverrides?:
    | GlobalThemeOverrides
    | {
        light?: GlobalThemeOverrides;
        dark?: GlobalThemeOverrides;
      };
  isDark?: MaybeComputedRef<boolean> | MaybeRef<boolean>;
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
    };
  };
};
