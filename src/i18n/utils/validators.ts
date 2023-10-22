import * as validators from "@vuelidate/validators";
import { i18n } from "../plugin";

const withI18nMessage = validators.createI18nMessage({
  t: i18n.global.t.bind(i18n),
});

export const required = withI18nMessage(validators.required);
export const requiredIf = withI18nMessage(validators.requiredIf);
export const requiredUnless = withI18nMessage(validators.requiredUnless);
export const sameAs = withI18nMessage(validators.sameAs);
export const url = withI18nMessage(validators.url);
export const email = withI18nMessage(validators.email);
export const alpha = withI18nMessage(validators.alpha);
export const alphaNum = withI18nMessage(validators.alphaNum);
export const numeric = withI18nMessage(validators.numeric);
export const between = withI18nMessage(validators.between);
export const decimal = withI18nMessage(validators.decimal);
export const integer = withI18nMessage(validators.integer);
export const ipAddress = withI18nMessage(validators.ipAddress);
export const macAddress = withI18nMessage(validators.macAddress);
export const maxLength = withI18nMessage(validators.maxLength);
export const maxValue = withI18nMessage(validators.maxValue);
export const minLength = withI18nMessage(validators.minLength);
export const minValue = withI18nMessage(validators.minValue);
export const not = withI18nMessage(validators.not);
export const or = withI18nMessage(validators.or);
export const and = withI18nMessage(validators.and);
