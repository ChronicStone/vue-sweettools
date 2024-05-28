<script setup lang="ts">
import type { QuickFilter, QuickFilterObject, QuickFilterOptions, QuickFilterPrimitive } from '@/data-list/types/shared'

const emit = defineEmits<{ (e: 'update:value', value: QuickFilterPrimitive[] | QuickFilterPrimitive): void }>()
const { label, value, options } = definePropsRefs<{
  type: QuickFilter['type']
  value: QuickFilterPrimitive[] | QuickFilterPrimitive | undefined
  label: string
  options: QuickFilterOptions
  multiple?: boolean
}>()

const searchQuery = ref<string>('')

const fieldValue = computed({
  get: () => value.value,
  set: value => emit('update:value', value),
})

const { state: resolvedOptions, isLoading } = useAsyncState(
  async () => {
    const _options = typeof options.value === 'function' ? await options.value() : options.value
    return _options.map((o) => {
      if (typeof o === 'object' && o)
        return o
      return { label: o, value: o }
    }) as QuickFilterObject[]
  },
  [],
)

const computedOptions = computed(() => {
  return resolvedOptions.value.filter(item =>
    item.value?.toString().toLowerCase().includes(searchQuery.value?.toString().toLowerCase())
  || item.label?.toString().toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>

<template>
  <PopoverSelect
    v-if="type === 'select-list'"
    v-model="fieldValue"
    :label="label"
    :options="computedOptions"
    :multiple="multiple"
    size="small"
    :is-loading="isLoading"
  />

  <ButtonToggle
    v-else-if="type === 'toggle-list'"
    v-model="fieldValue"
    :options="computedOptions"
    size="small"
    :multiple="multiple ?? false"
    :is-loading="isLoading"
  />
</template>
