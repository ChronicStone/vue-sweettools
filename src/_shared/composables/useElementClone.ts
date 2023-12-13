export function useElementClone(selector: string) {
  const clonedElement = ref<Element | null>(null)
  let observer: MutationObserver | null = null

  const updateClone = () => {
    const element = document.querySelector(selector)
    if (element)
      clonedElement.value = element.cloneNode(true) as Element
  }

  const startObserving = () => {
    const element = document.querySelector(selector)
    if (element && !observer) {
      observer = new MutationObserver(updateClone)
      observer.observe(element, { childList: true, subtree: true, attributes: true, characterData: true })
      updateClone()
    }
  }

  const resync = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    startObserving()
  }

  onMounted(startObserving)

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    clonedElement,
    resync,
  }
}
