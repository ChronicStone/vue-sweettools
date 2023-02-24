import { ComputedRef } from "vue";
import { FormSchema } from "@/types/form/form";
import InlineLayout from "@/components/Form/Layout/InlineLayout.vue";

export function useFormLayout(schema: ComputedRef<FormSchema>) {
  return computed(() => InlineLayout);
}
