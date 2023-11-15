import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { VNodeChild } from 'vue'

export function useConfirmDialog(
  dialogApi: DialogApiInjection,
  {
    type = 'create',
    title,
    content,
    positiveText = 'Yes',
    negativeText = 'No',
  }: {
    type: 'create' | 'success' | 'error' | 'warning' | 'info'
    title: string | (() => VNodeChild)
    content?: string | (() => VNodeChild)
    positiveText?: string
    negativeText?: string
    closable?: boolean
  },
) {
  return new Promise((resolve) => {
    dialogApi?.[type]({
      title,
      content,
      positiveText,
      negativeText,
      onPositiveClick: () => resolve(true),
      onNegativeClick: () => resolve(false),
      onClose: () => resolve(false),
      onMaskClick: () => resolve(false),
    })
  })
}
