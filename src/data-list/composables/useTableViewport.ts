import type { NDataTable } from 'naive-ui'

const [useProvideTableViewport, _useTableViewport] = createInjectionState(
  (params: {
    tableRef: Ref<InstanceType<typeof NDataTable> | undefined>
    tableWrapperRef: Ref<HTMLElement | undefined>
    scrollX: Ref<number>
  }) => {
    const { width: tableWidth } = useElementSize(params.tableWrapperRef)

    return {
      tableWidth,
      scrollX: params.scrollX,
      tableRef: params.tableRef,
      tableWrapperRef: params.tableWrapperRef,
    }
  },
)

function useTableViewport() {
  const _instance = _useTableViewport()
  if (!_instance)
    throw new Error('No parent table viewport provider found')
  return _instance
}

export { useProvideTableViewport, useTableViewport }
