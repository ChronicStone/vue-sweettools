import { FormField } from "@/types/form/fields";
import { ComputedRef } from "vue";

export function useFieldRules(field: FormField) {
  return computed(() => ({}));
}
