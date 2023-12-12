import type { NDataTable } from 'naive-ui'
import type { Ref } from 'vue'
import type { FullQueryState } from '../types/shared'

export function useTableScroll(params: {
  tableId: string
  tableWrapperRef: Ref<HTMLElement | undefined>
  tableRef: Ref<InstanceType<typeof NDataTable> | undefined>
  horizontalScrollbarHandleRef: Ref<HTMLElement | undefined>
  topViewportOffset: Ref<number>
  paginationState: FullQueryState['paginationState']

}) {
  const scrollViewportLoaded = ref(false)
  const xScrollable = ref(false)
  const scrollbarVisible = ref(false)
  const teleportActive = ref(false)
  const scrollbarWidth = ref(0)
  const scrollbarOffset = ref(0)
  const isDragScrolling = ref(false)
  const dragScrollStart = ref(0)
  const scrollX = ref(0)

  const { x: xMouse } = useMouse()
  const { width: windowWidth } = useWindowSize()
  const tableHover = useElementHover(params.tableWrapperRef)
  const tableElementExists = useElementObserver(`#${params.tableId} .n-data-table-base-table-body`, params.tableWrapperRef)

  function updateScrollbarState() {
    if (isDragScrolling.value)
      return
    const referenceContainer = document.querySelector(`#${params.tableId} .v-vl-visible-items`)
    const target = getTableContentEl()
    if (!target || !referenceContainer)
      return
    const handleSize = (target.clientWidth / referenceContainer.scrollWidth) * target.clientWidth
    scrollbarWidth.value = handleSize
    scrollbarOffset.value = (target.scrollLeft / referenceContainer.scrollWidth) * target.clientWidth
    xScrollable.value = target.scrollWidth > target.clientWidth
    scrollX.value = target.scrollLeft
  }

  function getTableContentEl() {
    return (params.tableRef.value?.$el as HTMLElement).querySelector('.v-vl')
  }

  function persistScrollPosition(e: Event) {
    const target = e.target as HTMLElement
    const scrollTop = target.scrollTop
    params.topViewportOffset.value = scrollTop
  }

  useEventListener('mouseup', () => isDragScrolling.value = false)
  useEventListener('mousedown', (e) => {
    if (e.target !== params.horizontalScrollbarHandleRef.value)
      return

    dragScrollStart.value = xMouse.value
    isDragScrolling.value = true
  })

  watch(windowWidth, updateScrollbarState)
  watch(tableHover, v => scrollbarVisible.value = v)

  watch(scrollbarOffset, (v) => {
    const containerWidth = getTableContentEl()?.clientWidth ?? 0
    const referenceContainer = document.querySelector(`#${params.tableId} .v-vl-visible-items`)
    if (!referenceContainer)
      return

    params.tableRef.value?.scrollTo({ left: (v / containerWidth) * referenceContainer.scrollWidth })
    scrollX.value = (v / containerWidth) * referenceContainer.scrollWidth
  })

  watch(xMouse, (xMouse) => {
    if (!isDragScrolling.value)
      return
    const containerWidth = getTableContentEl()?.clientWidth ?? 0
    const direction = xMouse > dragScrollStart.value ? 'right' : 'left'
    const distance = Math.abs(xMouse - dragScrollStart.value)
    scrollbarOffset.value = direction === 'right'
      ? scrollbarOffset.value + distance > containerWidth - scrollbarWidth.value
        ? containerWidth - scrollbarWidth.value
        : scrollbarOffset.value + distance
      : scrollbarOffset.value - distance < 0
        ? 0
        : scrollbarOffset.value - distance
    dragScrollStart.value = xMouse
  })

  watchDebounced(tableElementExists, (v) => {
    if (!v) {
      teleportActive.value = false
      return
    }
    teleportActive.value = true
    updateScrollbarState()
  }, { debounce: 100 })

  watch(() => tableElementExists.value, (v) => {
    if (scrollViewportLoaded.value || !v)
      return
    scrollViewportLoaded.value = true
    params.tableRef.value?.scrollTo({ top: params.topViewportOffset.value })
  })

  watch(() => params.paginationState.value.pageIndex, () => params.tableRef.value?.scrollTo({ top: 0 }))

  return {
    xScrollable,
    scrollbarVisible,
    teleportActive,
    scrollbarWidth,
    scrollbarOffset,
    isDragScrolling,
    dragScrollStart,
    scrollX,
    tableElementExists,
    tableHover,
    updateScrollbarState,
    persistScrollPosition,
  }
}
