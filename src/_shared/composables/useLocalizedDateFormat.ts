export function useLocalizedDateFormat() {
  const i18n = useTranslations()
  const { i18n: i18nConfig } = useGlobalConfig()
  const displayFormat = computed(
    () =>
      i18nConfig.dateDisplayFormat[i18n.locale.value]
      ?? i18nConfig.dateDisplayFormat.en,
  )

  const valueFormat = computed(
    () =>
      i18nConfig.dateValueFormat[i18n.locale.value]
      ?? i18nConfig.dateValueFormat.en,
  )

  return {
    displayFormat,
    valueFormat,
  }
}
