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
};
