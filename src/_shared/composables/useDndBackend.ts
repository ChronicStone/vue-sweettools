import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

export function useDndBackend() {
  const { isMobileOrTablet } = useDevice()
  const backend = ref<typeof HTML5Backend | typeof TouchBackend>(isMobileOrTablet.value ? TouchBackend : HTML5Backend) // Default to HTML5

  return backend
}
