import { GlobalThemeOverrides } from "naive-ui";
import { PLUGIN_CONF_INJECTION_KEY } from "@/config/injectionKeys";
import { get } from "@vueuse/core";
import { inject, computed, Ref } from "vue";

export function useGlobalConfig() {
  const config = inject(PLUGIN_CONF_INJECTION_KEY, { isDark: false });
  const isDark = computed<boolean>(
    () => (config?.isDark as Ref<boolean>)?.value ?? config?.isDark ?? false
  );
  const themeOverrides = computed<GlobalThemeOverrides>(() =>
    isDark.value
      ? (config?.themeOverrides as { dark: GlobalThemeOverrides })?.dark ??
        config?.themeOverrides ??
        {}
      : (config?.themeOverrides as { light: GlobalThemeOverrides })?.light ??
        config?.themeOverrides ??
        {}
  );

  return {
    isDark,
    themeOverrides,
  };
}
