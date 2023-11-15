import type { ComputedRef } from 'vue'
import InlineLayout from '../components/Layout/InlineLayout.vue'
import type { useFormStyles } from './useFormStyles'
import FullScreenLayout from '@/form/components/Layout/FullScreenLayout.vue'
import ModalLayout from '@/form/components/Layout/ModalLayout.vue'

export function useFormLayout(
  modalMode: ComputedRef<boolean>,
  styles: NonNullable<ReturnType<typeof useFormStyles>>,
) {
  return computed(() =>
    !modalMode.value
      ? InlineLayout
      : styles.fullScreen.value
        ? FullScreenLayout
        : ModalLayout,
  )
}
