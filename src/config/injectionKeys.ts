import { SweettoolsPluginConfig } from "@/types/lib";
import { InjectionKey } from "vue";

export const PLUGIN_CONF_INJECTION_KEY: InjectionKey<SweettoolsPluginConfig> =
  Symbol("SweetformsPluginConfig");
