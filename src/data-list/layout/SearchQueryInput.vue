<script setup lang="ts">
import { type InputProps, NInput } from 'naive-ui'

const props = defineProps<{ searchQuery: string; size?: InputProps['size'] }>()
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
