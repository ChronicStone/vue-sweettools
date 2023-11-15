<script setup lang="ts">
import { definePropsRefs } from 'unplugin-vue-macros/macros'
import { NList } from 'naive-ui'
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
</script>

<template>
  <NList hoverable :style="{ paddingLeft: `${3 * (depth + 1)}px` }">
    <ColumnConfigGroup
      v-for="(columnConfig, index) in columns"
      :key="columnConfig.key"
      v-model:column="columns[index]"
      :index="index"
      :depth="0"
      @update:order="moveCard"
    />
  </NList>
</template>
