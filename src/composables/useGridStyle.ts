import { changeRgbaOpacity } from "@/utils/manipulateColor";
import { GlobalTheme, darkTheme, useThemeVars } from "naive-ui";
import { ComputedRef, computed } from "vue";
import tiny from "tinycolor2";

export function useGridStyle(isDark: ComputedRef<boolean>) {
  const themeVars = useThemeVars();

  const theme = computed<GlobalTheme | null>(() =>
    isDark.value ? darkTheme : null
  );

  const borderColor = computed(() =>
    isDark.value
      ? changeRgbaOpacity(themeVars.value.borderColor, 0.1)
      : themeVars.value.borderColor
  );

  const selectedCellColor = computed(() =>
    isDark.value
      ? themeVars.value.bodyColor
      : tiny(themeVars.value.bodyColor).darken(20)
  );

  const hoverCellColor = computed(() =>
    isDark.value
      ? tiny(themeVars.value.bodyColor).lighten(5)
      : tiny(themeVars.value.bodyColor).darken(10)
  );

  return { themeVars, borderColor, selectedCellColor, hoverCellColor, theme };
}
