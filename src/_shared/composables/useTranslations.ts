import { useGlobalConfig } from './useGlobalConfig'

export function useTranslations() {
  const { i18n } = useGlobalConfig()

  return useI18n({
    useScope: 'global',
    inheritLocale: i18n.enable,
    messages: i18n.translations,
    fallbackLocale: 'en',
  })
}
