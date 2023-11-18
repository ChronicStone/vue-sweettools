import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

export function useDndBackend() {
  const backend = ref<typeof HTML5Backend | typeof TouchBackend>(HTML5Backend) // Default to HTML5

  const switchToTouch = () => backend.value = TouchBackend
  const switchToHTML = () => backend.value = HTML5Backend

  useEventListener(window, 'touchstart', switchToTouch, { passive: true })
  useEventListener(window, 'mousemove', switchToHTML, { passive: true })

  return backend
}
