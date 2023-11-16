<!-- eslint-disable ts/no-use-before-define -->

<script setup lang="ts">
import { definePropsRefs } from 'unplugin-vue-macros/macros'
import {
  NButton,
  NCheckbox,
  NCollapseTransition,
  NListItem,
  useThemeVars,
} from 'naive-ui'
import { useDrag, useDrop } from 'vue3-dnd'
import type { Identifier, XYCoord } from 'dnd-core'
import type { RuntimeColsConfig } from '../composables/useTableColums.js'
import { ColumnConfigDragTypes } from '../utils/columns'

defineOptions({ name: 'ColumnConfigGroup' })

const emit = defineEmits<{ 'update:order': [number, number] }>()
const themeVars = useThemeVars()
const { depth, index } = definePropsRefs<{ depth: number; index: number }>()
const { column } = defineModels<{ column: RuntimeColsConfig[number] }>()

const collapsed = ref<boolean>(true)
const collapsible = computed(() => {
  return column.value.children && column.value.children.length > 0
})

interface DragItem {
  index: number
  id: string
  type: string
}

const wrapperRef = ref<HTMLDivElement>()
function setRef(el: HTMLDivElement) {
  wrapperRef.value = drag(drop(el)) as HTMLDivElement
}

const [dropCollect, drop] = useDrop<
  DragItem,
  void,
  { handlerId: Identifier | null }
>({
  accept: `${ColumnConfigDragTypes.COLUMN}_${depth.value}`,
  collect(monitor) {
    return {
      handlerId: monitor.getHandlerId(),
    }
  },
  hover(item: DragItem, monitor) {
    if (item.type !== `${ColumnConfigDragTypes.COLUMN}_${depth.value}`)
      return
    if (!wrapperRef.value)
      return

    const dragIndex = item.index
    const hoverIndex = index.value
    if (dragIndex === hoverIndex)
      return

    const hoverBoundingRect = wrapperRef.value?.getBoundingClientRect()
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
      return

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      return

    emit('update:order', dragIndex, hoverIndex)
    item.index = hoverIndex
  },
},
)

const [collect, drag, preview] = useDrag(() => ({
  type: `${ColumnConfigDragTypes.COLUMN}_${depth.value}`,
  item: () => {
    return { id: column.value.key, index: index.value, type: `${ColumnConfigDragTypes.COLUMN}_${depth.value}` }
  },
  collect: monitor => ({
    opacity: monitor.isDragging() ? 0.4 : 1,
    isDragging: monitor.isDragging(),
  }),
}))

function setFixed(fixed: 'left' | 'right') {
  if (column.value.fixed === fixed)
    column.value.fixed = undefined
  else
    column.value.fixed = fixed
}
</script>

<template>
  <div v-if="column?.condition?.() ?? true" :ref="preview" :style="{ opacity: collect.opacity, paddingLeft: `${(depth + 1) * 5}px` }" :data-handler-id="dropCollect.handlerId">
    <NListItem
      :class="{ 'border-l-2': column.visible }"
      :style="{ borderColor: themeVars.primaryColor, borderRadius: '0' }"
    >
      <div
        :ref="(setRef as any)"
        class="flex items-center justify-between gap-2 px-2"
      >
        <div class="flex items-center gap-4">
          <mdi:drag class="cursor-move text-lg" />
          <NCheckbox v-model:checked="column.visible" />
          <component :is="renderVNode(column.label) ?? ''" />
        </div>
        <div class="flex items-center gap-1">
          <NButton
            v-if="collapsible"
            size="tiny"
            circle
            secondary
            @click="collapsed = !collapsed"
          >
            <template #icon>
              <mdi:chevron-right
                class="transform transition-all duration-200 ease-in-out"
                :class="{ 'rotate-90': !collapsed }"
              />
            </template>
          </NButton>

          <NButton size="tiny" secondary :type="column.fixed === 'left' ? 'primary' : 'default'" @click="setFixed('left')">
            <template #icon>
              <span class="iconify" data-icon="radix-icons:pin-left" />
            </template>
          </NButton>
          <NButton size="tiny" secondary :type="column.fixed === 'right' ? 'primary' : 'default'" @click="setFixed('right')">
            <template #icon>
              <span class="iconify" data-icon="radix-icons:pin-right" />
            </template>
          </NButton>
        </div>
      </div>
    </NListItem>
    <NCollapseTransition :show="!collapsed">
      <ColumnConfig
        v-model:columns="column.children"
        :depth="depth + 1"
      />
    </NCollapseTransition>
  </div>
</template>
