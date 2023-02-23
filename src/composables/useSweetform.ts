import { FORM_INJECTION_KEY } from "@/config/injectionKeys";
import { inject } from "vue";

export function useSweetform() {
  const formApi = inject(FORM_INJECTION_KEY);
  if (!formApi) throw new Error("No form provider found on parent scope");
  return formApi;
}
