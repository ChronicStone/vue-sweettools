import * as validators from '@vuelidate/validators'

export function useLocalizedValidators() {
  const i18n = useTranslations()
  if (!i18n)
    throw new Error('No parent i18n API on current scope')

  const withI18nMessage = validators.createI18nMessage({
    t: i18n.t.bind(i18n),
    messagePath: ({ $validator }) => `form.validators.${$validator}`,
  })

  const required = withI18nMessage(validators.required)
  const requiredIf = withI18nMessage(validators.requiredIf, {
    withArguments: true,
  })
  const requiredUnless = withI18nMessage(validators.requiredUnless, {
    withArguments: true,
  })
  const sameAs = withI18nMessage(validators.sameAs, { withArguments: true })
  const url = withI18nMessage(validators.url)
  const email = withI18nMessage(validators.email)
  const alpha = withI18nMessage(validators.alpha)
  const alphaNum = withI18nMessage(validators.alphaNum)
  const numeric = withI18nMessage(validators.numeric)
  const between = withI18nMessage(validators.between, { withArguments: true })
  const decimal = withI18nMessage(validators.decimal)
  const integer = withI18nMessage(validators.integer)
  const ipAddress = withI18nMessage(validators.ipAddress)
  const macAddress = withI18nMessage(validators.macAddress, {
    withArguments: true,
  })
  const maxLength = withI18nMessage(validators.maxLength, {
    withArguments: true,
  })
  const maxValue = withI18nMessage(validators.maxValue, {
    withArguments: true,
  })
  const minLength = withI18nMessage(validators.minLength, {
    withArguments: true,
  })
  const minValue = withI18nMessage(validators.minValue, {
    withArguments: true,
  })
  const not = withI18nMessage(validators.not)
  const or = withI18nMessage(validators.or)
  const and = withI18nMessage(validators.and)

  return {
    i18n,
    withI18nMessage,
    required,
    requiredIf,
    requiredUnless,
    sameAs,
    url,
    email,
    alpha,
    alphaNum,
    numeric,
    between,
    decimal,
    integer,
    ipAddress,
    macAddress,
    maxLength,
    maxValue,
    minLength,
    minValue,
    not,
    or,
    and,
  }
}
