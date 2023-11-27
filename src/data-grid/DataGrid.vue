<script setup lang="ts">
import { NEmpty } from 'naive-ui'
import { computed } from 'vue'
import DataGridItem from './DataGridItem.vue'
import type { DataGridProps } from './types'

const props = defineProps<DataGridProps>()

const isLoading = computed<boolean>(() => !props.data)

const _gridRowSize = useBreakpointStyle(props?.gridRowSize ?? '1', 'grid-rows')
const _gridColSize = useBreakpointStyle(
  props?.gridColSize ?? '1 md:3 lg:4 xl:5',
  'grid-cols',
)

const virtualStore = asyncComputed<Record<string, unknown>>(() => {
  if (!Object.keys(props.virtualStore ?? {}).length)
    return false
  return Object.entries(props.virtualStore ?? {}).reduce(
    async (acc, [key, item]) => {
      return {
        ...acc,
        [key]:
          typeof item.value === 'function' ? await item.value() : item.value,
      }
    },
    {},
  )
}, {})

const mappedSchema = computed(
  () =>
    props.fields?.filter(Boolean).filter((item) => {
      if (!item.condition) { return item }
      else {
        return item.condition({
          value: getObjectProperty({
            key: item.key,
            scoped: false,
            object: (props?.data ?? {}),
          }),
          data: props?.data ?? {},
          store: virtualStore.value,
        })
      }
    }) ?? [],
)
</script>

<template>
  <div
    v-if="mappedSchema?.length"
    class="grid gap-4 auto-rows-min"
    :style="`${_gridColSize};${_gridRowSize};`"
  >
    <DataGridItem
      v-for="(field, index) in mappedSchema"
      :key="index"
      :virtual-store="virtualStore"
      :field-schema="field"
      :data="data"
      :is-loading="isLoading"
    />
  </div>

  <div v-else class="w-full grid place-items-center">
    <NEmpty />
  </div>
</template>
