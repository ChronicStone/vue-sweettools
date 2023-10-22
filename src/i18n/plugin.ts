import { LocaleTemplate } from "@/types/i18n";
import { type App } from "vue";
import { createI18n } from "vue-i18n";

export const i18n = createI18n({
  legacy: false,
  locale: "en",
});
