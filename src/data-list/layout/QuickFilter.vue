<script setup lang="ts">
import type { QuickFilter } from '../types/shared'

const { quickFilters } = defineProps<{ quickFilters: Array<QuickFilter> }>()
const filterState = defineModel<Record<string, any>>('filterState', { required: true })

const computedFilters = computed(() => quickFilters.filter(f => f.condition?.() ?? true))
</script>

<template>
  <NEl v-if="computedFilters.length" class="p-2  border-0 border-t-1 border-[var(--n-border-color)] border-solid" tag="div">
    <NScrollbar x-scrollable>
      <div class="flex item-center gap-2">
        <QuickFilterItem
          v-for="item in computedFilters"
          :key="item.key"
          :type="item.type"
          :multiple="item.multiple"
          :value="filterState[item.key]"
          :options="item.options"
          :label="item.label"
          @update:value="(v) => (filterState[item.key] = v)"
        />
      </div>
    </NScrollbar>
  </NEl>
</template>
