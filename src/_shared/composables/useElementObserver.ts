import type { Ref } from 'vue'

export default function useElementObserver(selector: string, elementRef: Ref<Element | undefined>) {
  const elementExists = ref(false)

  const checkElement = () => {
    const element = document.querySelector(selector)
    elementExists.value = !!element
  }

  let observer: MutationObserver

  watchEffect(() => {
    if (!(elementRef.value))
      return

    observer = new MutationObserver(checkElement)
    observer.observe(elementRef.value, { childList: true, subtree: true })
    checkElement()
  })

  onUnmounted(() => {
    if (observer)
      observer.disconnect()
  })

  return elementExists
}
