<!-- eslint-disable ts/no-use-before-define -->

<script setup lang="ts">
import { definePropsRefs } from 'unplugin-vue-macros/macros'
import {
  NButton,
  NCheckbox,
  NCollapseTransition,
} from 'naive-ui'
import type { RuntimeColsConfig } from '../composables/useTableColums.js'

defineOptions({ name: 'ColumnConfigGroup' })

const { depth } = definePropsRefs<{ depth: number, index: number }>()
const { column } = defineModels<{ column: RuntimeColsConfig[number] }>()

const collapsed = ref<boolean>(true)
const collapsible = computed(() => {
  return column.value.children && column.value.children.length > 0
})

function setFixed(fixed: 'left' | 'right') {
  if (column.value.fixed === fixed)
    column.value.fixed = undefined
  else
    column.value.fixed = fixed
}
</script>

<template>
  <div v-if="column?.condition?.() ?? true" class="p-2" :data-draggable="!!column.fixed">
    <div
      class="flex items-center justify-between gap-2 px-2"
    >
      <div class="flex items-center gap-4">
        <NButton :disabled="!!column.fixed" text class="drag-handle" :class="{ 'cursor-move': !column.fixed }">
          <material-symbols:drag-handle-rounded class=" text-lg " />
        </NButton>
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
    <NCollapseTransition :show="!collapsed">
      <ColumnConfig
        v-model:columns="column.children"
        :depth="depth + 1"
      />
    </NCollapseTransition>
  </div>
</template>
