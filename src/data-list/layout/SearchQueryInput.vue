<script setup lang="ts">
import { NInput } from 'naive-ui'
import type { Size } from 'naive-ui/es/select/src/interface'

const props = defineProps<{ searchQuery: string; size?: Size }>()
const emit = defineEmits<{ (e: 'update:searchQuery', value: string): void }>()
const i18n = useTranslations()
const localValue = ref<string>(props.searchQuery)
</script>

<template>
  <NInput
    v-model:value="localValue"
    clearable
    :size="size ?? 'medium'"
    :placeholder="i18n.t('datatable.searchQueryPlaceholder')"
    :on-change="() => emit('update:searchQuery', localValue)"
  />
</template>
