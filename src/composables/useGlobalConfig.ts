import { SweettoolsPluginConfig } from "@/types/lib";
import { FormSchema } from "@/types/form/form";
import { GlobalThemeOverrides } from "naive-ui";
import { PLUGIN_CONF_INJECTION_KEY } from "@/config/injectionKeys";
import { NestedPaths, TypeFromPath } from "@/types/utils";
import { Ref } from "vue";
import { getPropertyFromPath } from "@/utils/form/getPropertyFromPath";

const DEFAULT_FORM_CONFIG = {
  textOverrides: {
    requiredMessage: (label: string | (() => string)) =>
      `The field ${
        typeof label === "function"
          ? label()?.toLocaleLowerCase()
          : label.toLocaleLowerCase()
      } can't be empty`,
    nextBtnMessage: "NEXT",
    prevBtnMessage: "BACK",
    submitBtnMessage: "SUBMIT",
    cancelBtnMessage: "CANCEL",
  },
  uiConfig: {
    showStepper: true,
    showCloseButton: true,
    showCancelButton: false,
    showPrevButton: true,
    allowOutsideClick: true,
  },
} as const;

export function useGlobalConfig(formSchema?: FormSchema) {
  const config = inject(PLUGIN_CONF_INJECTION_KEY, {
    isDark: false,
    form: DEFAULT_FORM_CONFIG,
  });
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

  const permissionValidator = computed<
    (keys: Array<string | string[]>) => boolean
  >(() => config?.permissionValidator ?? ((keys) => true));

  const formConfig = computed(() => ({
    textOverrides: {
      requiredMessage:
        formSchema?.requiredMessage ??
        config?.form?.textOverrides?.requiredMessage ??
        DEFAULT_FORM_CONFIG.textOverrides.requiredMessage,
      nextBtnMessage:
        formSchema?.nextButtonText ??
        config?.form?.textOverrides?.nextBtnMessage ??
        DEFAULT_FORM_CONFIG.textOverrides.nextBtnMessage,
      prevBtnMessage:
        formSchema?.prevButtonText ??
        config?.form?.textOverrides?.prevBtnMessage ??
        DEFAULT_FORM_CONFIG.textOverrides.prevBtnMessage,
      submitBtnMessage:
        formSchema?.submitButtonText ??
        config?.form?.textOverrides?.submitBtnMessage ??
        DEFAULT_FORM_CONFIG.textOverrides.submitBtnMessage,
      cancelBtnMessage:
        formSchema?.cancelButtonText ??
        config?.form?.textOverrides?.cancelBtnMessage ??
        DEFAULT_FORM_CONFIG.textOverrides.cancelBtnMessage,
    },
    uiConfig: {
      showStepper:
        formSchema?.showStepper ??
        config?.form?.uiConfig?.showStepper ??
        DEFAULT_FORM_CONFIG.uiConfig.showStepper,
      showCloseButton:
        formSchema?.showCloseButton ??
        config?.form?.uiConfig?.showCloseButton ??
        DEFAULT_FORM_CONFIG.uiConfig.showCloseButton,
      showCancelButton:
        formSchema?.showCancelButton ??
        config?.form?.uiConfig?.showCancelButton ??
        DEFAULT_FORM_CONFIG.uiConfig.showCancelButton,
      showPrevButton:
        formSchema?.showPrevButton ??
        config?.form?.uiConfig?.showPrevButton ??
        DEFAULT_FORM_CONFIG.uiConfig.showPrevButton,
      allowOutsideClick:
        formSchema?.allowOutsideClick ??
        config?.form?.uiConfig?.allowOutsideClick ??
        DEFAULT_FORM_CONFIG.uiConfig.allowOutsideClick,
    },
  }));

  function getProp<
    T extends NestedPaths<NonNullable<SweettoolsPluginConfig["form"]>> & string
  >(
    key: T
  ): NonNullable<TypeFromPath<NonNullable<SweettoolsPluginConfig["form"]>, T>> {
    return getPropertyFromPath(key as string, formConfig.value);
  }

  const test = getProp("textOverrides.requiredMessage");

  return {
    isDark,
    themeOverrides,
    formConfig,
    permissionValidator,
    getProp,
  };
}
