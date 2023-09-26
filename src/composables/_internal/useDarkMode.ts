import { ref } from "vue";

const isDark = ref<boolean>(false);

export function useDarkMode() {
  return {
    isDark,
    toggleTheme: () => (isDark.value = !isDark.value),
    setTheme: (dark: boolean) => (isDark.value = dark),
  };
}
