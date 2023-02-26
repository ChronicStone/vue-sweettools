import { ComputedRef } from "vue";
import { FormSchema } from "@/types/form/form";
import InlineLayout from "@/components/Form/Layout/InlineLayout.vue";
import FullScreenLayout from "@/components/Form/Layout/FullScreenLayout.vue";
import ModalLayout from "@/components/Form/Layout/ModalLayout.vue";

export function useFormLayout(
  modalMode: ComputedRef<boolean>,
  styles: NonNullable<ReturnType<typeof useFormStyles>>
) {
  return computed(() =>
    !modalMode.value
      ? InlineLayout
      : styles.fullScreen.value
      ? FullScreenLayout
      : ModalLayout
  );
}
