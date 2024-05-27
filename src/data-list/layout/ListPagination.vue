<script setup lang="ts">
import { NPagination, NSelect } from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { DataQueryState } from '../types/shared'

const props = defineProps<{
  paginationState: DataQueryState['pagination']
  compact?: boolean
  footerStyle?: string | CSSProperties
  footerClass?: string | Array<string | Record<string, boolean>>
}>()
const emit = defineEmits<{
  (e: 'update:paginationState', value: DataQueryState['pagination']): void
}>()

const isMobile = useIsMobile()
const i18n = useTranslations()

const _paginationState = computed({
  get: () => props.paginationState,
  set: (value: DataQueryState['pagination']) =>
    emit('update:paginationState', value),
})

const paginationScope = computed(() => {
  return {
    start:
      _paginationState.value.pageSize * _paginationState.value.pageIndex
      - (_paginationState.value.pageSize - 1),
    end: _paginationState.value.pageSize * _paginationState.value.pageIndex,
    total: _paginationState.value.rowTotalCount,
  }
})
</script>

<template>
  <div
    class="flex w-full flex-col !md:flex-row !md:justify-between !md:items-center gap-4"
    :style="footerStyle"
    :class="footerClass"
  >
    <div
      class="flex items-center w-full gap-3 justify-between !md:justify-start"
    >
      <NSelect
        v-model:value="_paginationState.pageSize"
        :size="compact ? 'small' : 'medium'"
        class="max-w-32"
        placeholder="Page size"
        :options="
          [5, 10, 25, 50, 100].map((i) => ({
            label: i18n.t('datatable.numberOfDisplayedRows', { count: i }),
            value: i,
          }))
        "
      />
      <span>
        {{ i18n.t("datatable.paginationInfo", paginationScope) }}
      </span>
    </div>
    <div class="w-full flex justify-center !md:justify-end">
      <NPagination
        v-model:page="_paginationState.pageIndex"
        :size="compact ? 'small' : 'medium'"
        :page-count="_paginationState.pageTotalCount"
        :page-sizes="[10, 20, 30, 40]"
        :page-slot="isMobile ? 3 : 8"
      />
    </div>
  </div>
</template>
