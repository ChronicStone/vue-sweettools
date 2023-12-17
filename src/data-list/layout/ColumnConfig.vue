<script setup lang="ts">
import { definePropsRefs } from 'unplugin-vue-macros/macros'
import { useDraggable } from 'vue-draggable-plus'
import type { RuntimeColsConfig } from '../composables/useTableColums'
import ColumnConfigGroup from './ColumnConfigGroup.vue'

defineOptions({ name: 'ColumnConfig' })

const { depth } = definePropsRefs<{ depth: number }>()
const { columns } = defineModels<{
  columns: RuntimeColsConfig
}>()

function moveCard(dragIndex: number, hoverIndex: number) {
  const item = columns.value[dragIndex]
  columns.value.splice(dragIndex, 1)
  columns.value.splice(hoverIndex, 0, item)
  columns.value.forEach((column, index) => {
    column.order = index
  })
}

const listRef = ref<HTMLElement>()

const { start } = useDraggable(listRef, columns, {
  animation: 150,
  handle: '.drag-handle',
  filter: '[data-draggable="true"]',
  onEnd: () => {
    columns.value.forEach((_, index) => {
      columns.value[index].order = index
    })
  },
})

onMounted(() => start(listRef.value))
</script>

<template>
  <div ref="listRef" hoverable :style="{ paddingLeft: `${3 * (depth + 1)}px` }">
    <ColumnConfigGroup
      v-for="(columnConfig, index) in columns"
      :key="columnConfig.key"
      v-model:column="columns[index]"
      :index="index"
      :depth="0"
      @update:order="moveCard"
    />
  </div>
</template>
